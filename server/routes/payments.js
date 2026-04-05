import { Router } from 'express';
import Stripe from 'stripe';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { supabase } from '../lib/supabase.js';

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payments/stripe/create-intent
router.post('/api/payments/stripe/create-intent', async (req, res) => {
  try {
    const { amount, currency = 'inr', order_id, metadata = {} } = req.body;

    if (!amount || !order_id) {
      return res.status(400).json({ success: false, error: 'Amount and order_id are required' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects smallest currency unit
      currency: currency.toLowerCase(),
      metadata: {
        order_id,
        ...metadata,
      },
    });

    // Update order with payment intent ID
    await supabase
      .from('orders')
      .update({
        payment_intent_id: paymentIntent.id,
        payment_method: 'stripe',
      })
      .eq('id', order_id);

    return res.json({
      success: true,
      data: {
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id,
      },
    });
  } catch (err) {
    console.error('Stripe create intent error:', err);
    return res.status(500).json({ success: false, error: 'Failed to create payment intent' });
  }
});

// POST /api/payments/razorpay/create-order
router.post('/api/payments/razorpay/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', order_id, receipt } = req.body;

    if (!amount || !order_id) {
      return res.status(400).json({ success: false, error: 'Amount and order_id are required' });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency: currency.toUpperCase(),
      receipt: receipt || `order_${order_id}`,
      notes: { order_id },
    });

    // Update order with razorpay order ID
    await supabase
      .from('orders')
      .update({
        razorpay_order_id: razorpayOrder.id,
        payment_method: 'razorpay',
      })
      .eq('id', order_id);

    return res.json({
      success: true,
      data: {
        razorpay_order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key_id: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (err) {
    console.error('Razorpay create order error:', err);
    return res.status(500).json({ success: false, error: 'Failed to create Razorpay order' });
  }
});

// POST /api/webhooks/stripe - Stripe webhook handler
// Note: this route uses raw body parsing, configured in index.js
router.post('/api/webhooks/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err.message);
    return res.status(400).json({ success: false, error: 'Invalid signature' });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        await supabase
          .from('orders')
          .update({
            payment_status: 'paid',
            status: 'confirmed',
            stripe_payment_id: paymentIntent.id,
            paid_at: new Date().toISOString(),
          })
          .eq('payment_intent_id', paymentIntent.id);
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        await supabase
          .from('orders')
          .update({
            payment_status: 'failed',
            status: 'payment_failed',
          })
          .eq('payment_intent_id', paymentIntent.id);
        break;
      }
      default:
        // Unhandled event type
        break;
    }

    return res.json({ success: true, data: { received: true } });
  } catch (err) {
    console.error('Stripe webhook processing error:', err);
    return res.status(500).json({ success: false, error: 'Webhook processing failed' });
  }
});

// POST /api/payments/razorpay/verify - verify Razorpay payment signature
router.post('/api/payments/razorpay/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, error: 'Missing payment verification fields' });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, error: 'Invalid payment signature' });
    }

    // Update order
    await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        status: 'confirmed',
        razorpay_payment_id,
        paid_at: new Date().toISOString(),
      })
      .eq('razorpay_order_id', razorpay_order_id);

    return res.json({
      success: true,
      data: { verified: true, payment_id: razorpay_payment_id },
    });
  } catch (err) {
    console.error('Razorpay verify error:', err);
    return res.status(500).json({ success: false, error: 'Payment verification failed' });
  }
});

export default router;

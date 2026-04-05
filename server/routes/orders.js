import { Router } from 'express';
import { supabase } from '../lib/supabase.js';

const router = Router();

// Generate a unique order number
function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ST-${timestamp}-${random}`;
}

// POST /api/orders - create a new order
router.post('/api/orders', async (req, res) => {
  try {
    const { items, shipping, billing, payment_method, coupon_code, notes } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, error: 'Order must contain at least one item' });
    }

    if (!shipping || !shipping.email) {
      return res.status(400).json({ success: false, error: 'Shipping information with email is required' });
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const { data: product, error } = await supabase
        .from('products')
        .select('id, name, price, compare_at_price, slug')
        .eq('id', item.product_id)
        .eq('is_active', true)
        .single();

      if (error || !product) {
        return res.status(400).json({ success: false, error: `Product not found: ${item.product_id}` });
      }

      const lineTotal = product.price * item.quantity;
      subtotal += lineTotal;

      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        product_slug: product.slug,
        variant: item.variant || null,
        size: item.size || null,
        quantity: item.quantity,
        unit_price: product.price,
        total_price: lineTotal,
      });
    }

    // Apply coupon if provided
    let discount = 0;
    let appliedCoupon = null;
    if (coupon_code) {
      const { data: coupon } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', coupon_code.toUpperCase())
        .eq('is_active', true)
        .single();

      if (coupon) {
        const now = new Date();
        const validFrom = coupon.valid_from ? new Date(coupon.valid_from) : null;
        const validTo = coupon.valid_to ? new Date(coupon.valid_to) : null;
        const withinDates = (!validFrom || now >= validFrom) && (!validTo || now <= validTo);
        const withinUsage = !coupon.max_uses || coupon.times_used < coupon.max_uses;
        const meetsMinimum = !coupon.min_order_amount || subtotal >= coupon.min_order_amount;

        if (withinDates && withinUsage && meetsMinimum) {
          if (coupon.discount_type === 'percentage') {
            discount = subtotal * (coupon.discount_value / 100);
            if (coupon.max_discount_amount) {
              discount = Math.min(discount, coupon.max_discount_amount);
            }
          } else {
            discount = Math.min(coupon.discount_value, subtotal);
          }
          appliedCoupon = coupon;
        }
      }
    }

    // Shipping cost (can be customized)
    const shippingCost = subtotal >= 999 ? 0 : 99;
    const tax = 0; // Tax calculation can be added later
    const totalAmount = subtotal - discount + shippingCost + tax;

    const orderNumber = generateOrderNumber();

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_email: shipping.email,
        customer_name: `${shipping.first_name} ${shipping.last_name}`,
        customer_phone: shipping.phone || null,
        shipping_address: shipping,
        billing_address: billing || shipping,
        subtotal,
        discount_amount: discount,
        coupon_code: appliedCoupon?.code || null,
        shipping_cost: shippingCost,
        tax_amount: tax,
        total_amount: totalAmount,
        currency: 'INR',
        payment_method: payment_method || 'pending',
        payment_status: 'pending',
        status: 'pending',
        notes: notes || null,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
    const itemsWithOrderId = orderItems.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsWithOrderId);

    if (itemsError) throw itemsError;

    // Update coupon usage
    if (appliedCoupon) {
      await supabase
        .from('coupons')
        .update({ times_used: appliedCoupon.times_used + 1 })
        .eq('id', appliedCoupon.id);
    }

    return res.status(201).json({
      success: true,
      data: {
        order_number: orderNumber,
        order_id: order.id,
        total_amount: totalAmount,
        currency: 'INR',
      },
    });
  } catch (err) {
    console.error('Error creating order:', err);
    return res.status(500).json({ success: false, error: 'Failed to create order' });
  }
});

// GET /api/orders/:orderNumber - get order by order number
router.get('/api/orders/:orderNumber', async (req, res) => {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('order_number', req.params.orderNumber)
      .single();

    if (error || !order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Remove sensitive fields for public access
    const { billing_address, notes, ...publicOrder } = order;

    return res.json({ success: true, data: publicOrder });
  } catch (err) {
    console.error('Error fetching order:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch order' });
  }
});

// GET /api/orders/:orderNumber/status - just the status
router.get('/api/orders/:orderNumber/status', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('order_number, status, payment_status, tracking_number, updated_at')
      .eq('order_number', req.params.orderNumber)
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    return res.json({ success: true, data });
  } catch (err) {
    console.error('Error fetching order status:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch order status' });
  }
});

export default router;

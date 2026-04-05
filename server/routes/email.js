import { Router } from 'express';
import nodemailer from 'nodemailer';
import { supabase } from '../lib/supabase.js';

const router = Router();

// Create reusable transporter
function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// POST /api/subscribe - add email subscriber
router.post('/api/subscribe', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('email_subscribers')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) {
      return res.json({ success: true, data: { message: 'Already subscribed' } });
    }

    const { error } = await supabase
      .from('email_subscribers')
      .insert({
        email: email.toLowerCase(),
        name: name || null,
      });

    if (error) throw error;

    return res.status(201).json({ success: true, data: { message: 'Successfully subscribed' } });
  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ success: false, error: 'Failed to subscribe' });
  }
});

// POST /api/contact - contact form submission
router.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required' });
    }

    // Send email notification
    try {
      const transporter = getTransporter();
      await transporter.sendMail({
        from: `"SikhiThreads" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
        replyTo: email,
        subject: `Contact Form: ${subject || 'General Inquiry'}`,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      });
    } catch (emailErr) {
      console.error('Failed to send contact email notification:', emailErr);
      // Don't fail the request if email fails - the message is saved in DB
    }

    return res.status(201).json({ success: true, data: { message: 'Message sent successfully' } });
  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(500).json({ success: false, error: 'Failed to send message' });
  }
});

// POST /api/custom-orders - submit custom order inquiry
router.post('/api/custom-orders', async (req, res) => {
  try {
    const { name, email, phone, type, description, reference_images, budget_range } = req.body;

    if (!name || !email || !description || !type) {
      return res.status(400).json({ success: false, error: 'Name, email, type, and description are required' });
    }

    const { data, error } = await supabase
      .from('custom_orders')
      .insert({
        name,
        email,
        phone: phone || null,
        type,
        description,
        reference_images: reference_images || [],
        budget_range: budget_range || null,
        status: 'inquiry',
      })
      .select()
      .single();

    if (error) throw error;

    // Send email notification
    try {
      const transporter = getTransporter();
      await transporter.sendMail({
        from: `"SikhiThreads" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
        replyTo: email,
        subject: `New Custom Order Inquiry from ${name}`,
        html: `
          <h3>New Custom Order Inquiry</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <p><strong>Description:</strong></p>
          <p>${description.replace(/\n/g, '<br>')}</p>
          ${quantity ? `<p><strong>Quantity:</strong> ${quantity}</p>` : ''}
          ${budget ? `<p><strong>Budget:</strong> ${budget}</p>` : ''}
          ${timeline ? `<p><strong>Timeline:</strong> ${timeline}</p>` : ''}
        `,
      });
    } catch (emailErr) {
      console.error('Failed to send custom order email notification:', emailErr);
    }

    return res.status(201).json({ success: true, data: { id: data.id, message: 'Custom order inquiry submitted' } });
  } catch (err) {
    console.error('Custom order error:', err);
    return res.status(500).json({ success: false, error: 'Failed to submit custom order' });
  }
});

export default router;

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payments.js';
import adminRoutes from './routes/admin.js';
import uploadRoutes from './routes/upload.js';
import emailRoutes from './routes/email.js';
import reviewRoutes from './routes/reviews.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Global Middleware ───────────────────────────────────────

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(helmet());
app.use(morgan('dev'));

// Stripe webhooks need the raw body for signature verification.
// This must be registered BEFORE express.json() is applied globally.
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));

// Parse JSON for all other routes
app.use(express.json({ limit: '10mb' }));

// Raw body parsing for file uploads
app.use('/api/upload', express.raw({ type: 'image/*', limit: '10mb' }));

// ─── Routes ──────────────────────────────────────────────────

// ─── Health Check ────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

app.use(productRoutes);
app.use(orderRoutes);
app.use(paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use(uploadRoutes);
app.use(emailRoutes);
app.use(reviewRoutes);

// ─── 404 Handler ─────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// ─── Global Error Handler ────────────────────────────────────

app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// ─── Start Server ────────────────────────────────────────────

// Only listen when running directly (not on Vercel)
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`SikhiThreads API server running on port ${PORT}`);
  });
}

export default app;

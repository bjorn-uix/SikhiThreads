import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { adminAuth } from '../middleware/auth.js';

const router = Router();

// Apply admin auth to all routes
router.use(adminAuth);

// Helper: generate slug from name
function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ─── Dashboard ───────────────────────────────────────────────

router.get('/dashboard', async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // Revenue queries
    const [todayRevenue, weekRevenue, monthRevenue] = await Promise.all([
      supabase.from('orders').select('total').eq('payment_status', 'paid').gte('created_at', todayStart),
      supabase.from('orders').select('total').eq('payment_status', 'paid').gte('created_at', weekStart),
      supabase.from('orders').select('total').eq('payment_status', 'paid').gte('created_at', monthStart),
    ]);

    const sumAmount = (rows) => (rows.data || []).reduce((sum, r) => sum + (r.total || 0), 0);

    // Order counts by status
    const { data: statusCounts } = await supabase.rpc('get_order_status_counts').catch(() => ({ data: null }));

    // Fallback: manual count if RPC not available
    let ordersByStatus = statusCounts;
    if (!ordersByStatus) {
      const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
      const counts = await Promise.all(
        statuses.map(async (status) => {
          const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('order_status', status);
          return { status, count: count || 0 };
        })
      );
      ordersByStatus = counts;
    }

    // Top products (by total_sales or order_items count)
    const { data: topProducts } = await supabase
      .from('products')
      .select('id, name, slug, price')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(10);

    return res.json({
      success: true,
      data: {
        revenue: {
          today: sumAmount(todayRevenue),
          week: sumAmount(weekRevenue),
          month: sumAmount(monthRevenue),
        },
        orders_by_status: ordersByStatus,
        top_products: topProducts || [],
      },
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    return res.status(500).json({ success: false, error: 'Failed to load dashboard' });
  }
});

// ─── Products ────────────────────────────────────────────────

router.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    const { data, error, count } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return res.json({
      success: true,
      data: {
        products: data,
        pagination: { page: pageNum, limit: limitNum, total: count, totalPages: Math.ceil(count / limitNum) },
      },
    });
  } catch (err) {
    console.error('Admin products list error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

router.post('/products', async (req, res) => {
  try {
    const productData = req.body;
    productData.slug = generateSlug(productData.name);

    // Ensure unique slug
    const { data: existing } = await supabase
      .from('products')
      .select('slug')
      .eq('slug', productData.slug)
      .single();

    if (existing) {
      productData.slug = `${productData.slug}-${Date.now().toString(36)}`;
    }

    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({ success: true, data });
  } catch (err) {
    console.error('Admin product create error:', err);
    return res.status(500).json({ success: false, error: 'Failed to create product' });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const updates = req.body;
    if (updates.name) {
      updates.slug = generateSlug(updates.name);
    }

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: 'Product not found' });

    return res.json({ success: true, data });
  } catch (err) {
    console.error('Admin product update error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update product' });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: 'Product not found' });

    return res.json({ success: true, data: { message: 'Product deactivated' } });
  } catch (err) {
    console.error('Admin product delete error:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
});

// ─── Orders ──────────────────────────────────────────────────

router.get('/orders', async (req, res) => {
  try {
    const { status, payment_status, from: fromDate, to: toDate, page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const rangeFrom = (pageNum - 1) * limitNum;
    const rangeTo = rangeFrom + limitNum - 1;

    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status) query = query.eq('order_status', status);
    if (payment_status) query = query.eq('payment_status', payment_status);
    if (fromDate) query = query.gte('created_at', fromDate);
    if (toDate) query = query.lte('created_at', toDate);

    query = query.range(rangeFrom, rangeTo);

    const { data, error, count } = await query;
    if (error) throw error;

    return res.json({
      success: true,
      data: {
        orders: data,
        pagination: { page: pageNum, limit: limitNum, total: count, totalPages: Math.ceil(count / limitNum) },
      },
    });
  } catch (err) {
    console.error('Admin orders list error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
});

router.put('/orders/:id', async (req, res) => {
  try {
    const { status, tracking_number, notes, payment_status } = req.body;
    const updates = {};
    if (status) updates.order_status = status;
    if (tracking_number !== undefined) updates.tracking_number = tracking_number;
    if (notes !== undefined) updates.notes = notes;
    if (payment_status) updates.payment_status = payment_status;

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: 'Order not found' });

    return res.json({ success: true, data });
  } catch (err) {
    console.error('Admin order update error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update order' });
  }
});

// ─── Customers ───────────────────────────────────────────────

router.get('/customers', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    const { data, error, count } = await supabase
      .from('customers')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return res.json({
      success: true,
      data: {
        customers: data,
        pagination: { page: pageNum, limit: limitNum, total: count, totalPages: Math.ceil(count / limitNum) },
      },
    });
  } catch (err) {
    console.error('Admin customers error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch customers' });
  }
});

// ─── Custom Orders ───────────────────────────────────────────

router.get('/custom-orders', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('custom_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json({ success: true, data });
  } catch (err) {
    console.error('Admin custom orders error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch custom orders' });
  }
});

router.put('/custom-orders/:id', async (req, res) => {
  try {
    const { status, quote_amount, admin_notes } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (quote_amount !== undefined) updates.quoted_price = quote_amount;
    if (admin_notes !== undefined) updates.notes = admin_notes;

    const { data, error } = await supabase
      .from('custom_orders')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: 'Custom order not found' });

    return res.json({ success: true, data });
  } catch (err) {
    console.error('Admin custom order update error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update custom order' });
  }
});

// ─── Coupons ─────────────────────────────────────────────────

router.get('/coupons', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json({ success: true, data });
  } catch (err) {
    console.error('Admin coupons error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch coupons' });
  }
});

router.post('/coupons', async (req, res) => {
  try {
    const couponData = req.body;
    couponData.code = couponData.code?.toUpperCase();

    const { data, error } = await supabase
      .from('coupons')
      .insert(couponData)
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json({ success: true, data });
  } catch (err) {
    console.error('Admin coupon create error:', err);
    return res.status(500).json({ success: false, error: 'Failed to create coupon' });
  }
});

router.put('/coupons/:id', async (req, res) => {
  try {
    const updates = req.body;
    if (updates.code) updates.code = updates.code.toUpperCase();

    const { data, error } = await supabase
      .from('coupons')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: 'Coupon not found' });

    return res.json({ success: true, data });
  } catch (err) {
    console.error('Admin coupon update error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update coupon' });
  }
});

// ─── Reviews ─────────────────────────────────────────────────

router.get('/reviews', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, products(name, slug)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json({ success: true, data });
  } catch (err) {
    console.error('Admin reviews error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
  }
});

router.put('/reviews/:id', async (req, res) => {
  try {
    const { is_approved } = req.body;

    const { data, error } = await supabase
      .from('reviews')
      .update({ is_approved })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: 'Review not found' });

    return res.json({ success: true, data });
  } catch (err) {
    console.error('Admin review update error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update review' });
  }
});

// ─── Settings ────────────────────────────────────────────────

router.get('/settings', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*');

    if (error) throw error;

    // Convert array of {key, value} to object
    const settings = (data || []).reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});

    return res.json({ success: true, data: settings });
  } catch (err) {
    console.error('Admin settings get error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch settings' });
  }
});

router.put('/settings', async (req, res) => {
  try {
    const settings = req.body;

    const upserts = Object.entries(settings).map(([key, value]) => ({
      key,
      value: typeof value === 'string' ? value : JSON.stringify(value),
    }));

    const { error } = await supabase
      .from('site_settings')
      .upsert(upserts, { onConflict: 'key' });

    if (error) throw error;

    return res.json({ success: true, data: { message: 'Settings updated' } });
  } catch (err) {
    console.error('Admin settings update error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update settings' });
  }
});

// ─── Collections ─────────────────────────────────────────────

router.get('/collections', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return res.json({ success: true, data });
  } catch (err) {
    console.error('Admin collections error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch collections' });
  }
});

router.post('/collections', async (req, res) => {
  try {
    const collectionData = req.body;
    collectionData.slug = generateSlug(collectionData.name);

    const { data, error } = await supabase
      .from('collections')
      .insert(collectionData)
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json({ success: true, data });
  } catch (err) {
    console.error('Admin collection create error:', err);
    return res.status(500).json({ success: false, error: 'Failed to create collection' });
  }
});

router.put('/collections/:id', async (req, res) => {
  try {
    const updates = req.body;
    if (updates.name) updates.slug = generateSlug(updates.name);

    const { data, error } = await supabase
      .from('collections')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: 'Collection not found' });

    return res.json({ success: true, data });
  } catch (err) {
    console.error('Admin collection update error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update collection' });
  }
});

router.delete('/collections/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    return res.json({ success: true, data: { message: 'Collection deleted' } });
  } catch (err) {
    console.error('Admin collection delete error:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete collection' });
  }
});

// ─── Subscribers ─────────────────────────────────────────────

router.get('/subscribers', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('email_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (error) throw error;
    return res.json({ success: true, data });
  } catch (err) {
    console.error('Admin subscribers error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch subscribers' });
  }
});

export default router;

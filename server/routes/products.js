import { Router } from 'express';
import { supabase } from '../lib/supabase.js';

const router = Router();

// GET /api/products - list products with filters
router.get('/api/products', async (req, res) => {
  try {
    const {
      category,
      collection,
      featured,
      search,
      sort = 'created_at',
      page = 1,
      limit = 12,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 12));
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('is_active', true);

    if (category) {
      query = query.eq('category', category);
    }

    if (collection) {
      query = query.contains('collection_tags', [collection]);
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Sorting
    const sortOptions = {
      'created_at': { column: 'created_at', ascending: false },
      'newest': { column: 'created_at', ascending: false },
      'price_asc': { column: 'price', ascending: true },
      'price_desc': { column: 'price', ascending: false },
      'best_sellers': { column: 'created_at', ascending: false },
      'name': { column: 'name', ascending: true },
    };
    const sortConfig = sortOptions[sort] || sortOptions['created_at'];
    query = query.order(sortConfig.column, { ascending: sortConfig.ascending });

    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return res.json({
      success: true,
      data: {
        products: data,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: count,
          totalPages: Math.ceil(count / limitNum),
        },
      },
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

// GET /api/products/:slug - single product by slug
router.get('/api/products/:slug', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', req.params.slug)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    return res.json({ success: true, data });
  } catch (err) {
    console.error('Error fetching product:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
});

// GET /api/collections - list all active collections
router.get('/api/collections', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;

    return res.json({ success: true, data });
  } catch (err) {
    console.error('Error fetching collections:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch collections' });
  }
});

// GET /api/collections/:slug - single collection with products
router.get('/api/collections/:slug', async (req, res) => {
  try {
    const { data: collection, error: colError } = await supabase
      .from('collections')
      .select('*')
      .eq('slug', req.params.slug)
      .eq('is_active', true)
      .single();

    if (colError || !collection) {
      return res.status(404).json({ success: false, error: 'Collection not found' });
    }

    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('*')
      .contains('collection_tags', [req.params.slug])
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (prodError) throw prodError;

    return res.json({ success: true, data: { ...collection, products } });
  } catch (err) {
    console.error('Error fetching collection:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch collection' });
  }
});

export default router;

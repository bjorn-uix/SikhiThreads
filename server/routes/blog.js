import { Router } from 'express';
import { supabase } from '../lib/supabase.js';

const router = Router();

// GET /api/blog — list published posts
router.get('/api/blog', async (req, res) => {
  try {
    const {
      category,
      tag,
      sort = 'published_at',
      page = 1,
      limit = 12,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    let query = supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, cover_image, author, category, tags, published_at, created_at', { count: 'exact' })
      .eq('is_published', true);

    if (category) {
      query = query.eq('category', category);
    }

    if (tag) {
      query = query.contains('tags', [tag]);
    }

    // Sorting
    const sortMap = {
      'published_at': { column: 'published_at', ascending: false },
      'title': { column: 'title', ascending: true },
      'oldest': { column: 'published_at', ascending: true },
    };
    const sortConfig = sortMap[sort] || sortMap['published_at'];
    query = query.order(sortConfig.column, { ascending: sortConfig.ascending });

    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    return res.json({
      success: true,
      data: {
        posts: data || [],
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limitNum),
        },
      },
    });
  } catch (err) {
    console.error('Blog list error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch blog posts' });
  }
});

// GET /api/blog/categories — list categories with post counts
router.get('/api/blog/categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('category')
      .eq('is_published', true);

    if (error) throw error;

    const counts = {};
    (data || []).forEach(row => {
      if (row.category) {
        counts[row.category] = (counts[row.category] || 0) + 1;
      }
    });

    const categories = Object.entries(counts).map(([name, count]) => ({ name, count }));

    return res.json({ success: true, data: categories });
  } catch (err) {
    console.error('Blog categories error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
});

// GET /api/blog/:slug — single post by slug
router.get('/api/blog/:slug', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', req.params.slug)
      .eq('is_published', true)
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, error: 'Blog post not found' });
    }

    return res.json({ success: true, data });
  } catch (err) {
    console.error('Blog post error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch blog post' });
  }
});

export default router;

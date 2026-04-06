import { Router } from 'express';
import { supabase } from '../lib/supabase.js';

const router = Router();

// GET /api/glossary — list all published glossary terms
router.get('/api/glossary', async (req, res) => {
  try {
    const { category, letter } = req.query;

    let query = supabase
      .from('glossary_terms')
      .select('*')
      .eq('is_published', true)
      .order('term', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    if (letter) {
      // Filter by first letter (case insensitive)
      const upper = letter.toUpperCase();
      const nextChar = String.fromCharCode(upper.charCodeAt(0) + 1);
      query = query.gte('term', upper).lt('term', nextChar);
    }

    const { data, error } = await query;
    if (error) throw error;

    return res.json({ success: true, data: data || [] });
  } catch (err) {
    console.error('Glossary list error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch glossary terms' });
  }
});

// GET /api/glossary/:slug — single term by slug
router.get('/api/glossary/:slug', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('glossary_terms')
      .select('*')
      .eq('slug', req.params.slug)
      .eq('is_published', true)
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, error: 'Glossary term not found' });
    }

    return res.json({ success: true, data });
  } catch (err) {
    console.error('Glossary term error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch glossary term' });
  }
});

export default router;

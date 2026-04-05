import { Router } from 'express';
import { supabase } from '../lib/supabase.js';

const router = Router();

// GET /api/reviews/:productId - get approved reviews for a product
router.get('/api/reviews/:productId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('id, customer_name, rating, title, comment, created_at')
      .eq('product_id', req.params.productId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Calculate average rating
    const avgRating = data.length > 0
      ? data.reduce((sum, r) => sum + r.rating, 0) / data.length
      : 0;

    return res.json({
      success: true,
      data: {
        reviews: data,
        average_rating: Math.round(avgRating * 10) / 10,
        total_reviews: data.length,
      },
    });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
  }
});

// POST /api/reviews - submit a review
router.post('/api/reviews', async (req, res) => {
  try {
    const { product_id, customer_name, customer_email, rating, title, comment } = req.body;

    if (!product_id || !customer_name || !rating || !comment) {
      return res.status(400).json({
        success: false,
        error: 'Product ID, customer name, rating, and comment are required',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, error: 'Rating must be between 1 and 5' });
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        product_id,
        customer_name,
        customer_email: customer_email || null,
        rating,
        title: title || null,
        comment,
        is_approved: false,
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      data: { message: 'Review submitted and pending approval', id: data.id },
    });
  } catch (err) {
    console.error('Error submitting review:', err);
    return res.status(500).json({ success: false, error: 'Failed to submit review' });
  }
});

export default router;

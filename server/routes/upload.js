import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { adminAuth } from '../middleware/auth.js';
import crypto from 'crypto';

const router = Router();

// POST /api/upload - upload image to Supabase Storage
router.post('/api/upload', adminAuth, async (req, res) => {
  try {
    const contentType = req.headers['content-type'] || 'image/jpeg';
    const fileBuffer = req.body;

    if (!fileBuffer || !fileBuffer.length) {
      return res.status(400).json({ success: false, error: 'No file data provided' });
    }

    // Generate a unique filename
    const ext = contentType.split('/')[1] || 'jpg';
    const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${ext}`;
    const filePath = `uploads/${filename}`;

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, fileBuffer, {
        contentType,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return res.status(201).json({
      success: true,
      data: {
        path: data.path,
        url: urlData.publicUrl,
      },
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ success: false, error: 'Failed to upload image' });
  }
});

export default router;

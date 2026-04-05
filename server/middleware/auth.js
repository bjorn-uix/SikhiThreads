import { supabase } from '../lib/supabase.js';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export async function adminAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Missing authorization token' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }

    if (!ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Admin auth error:', err);
    return res.status(500).json({ success: false, error: 'Authentication failed' });
  }
}

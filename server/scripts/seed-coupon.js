import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://zrifbfdityvyyxgomptl.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || ''
);

async function seedCoupons() {
  const coupons = [
    {
      code: 'FRIEND10',
      type: 'percentage',
      value: 10,
      min_order_amount: 25,
      is_active: true,
    },
    {
      code: 'VAISAKHI10',
      type: 'percentage',
      value: 10,
      min_order_amount: 0,
      is_active: true,
      expires_at: '2026-04-20T00:00:00Z',
    },
    {
      code: 'WELCOME15',
      type: 'percentage',
      value: 15,
      min_order_amount: 30,
      is_active: true,
    },
  ];

  const { data, error } = await supabase
    .from('coupons')
    .upsert(coupons, { onConflict: 'code' })
    .select();

  if (error) console.error('Error:', error);
  else console.log('Seeded coupons:', data.map(c => c.code).join(', '));
}

seedCoupons();

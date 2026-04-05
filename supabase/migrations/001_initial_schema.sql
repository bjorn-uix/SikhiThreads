-- ============================================================
-- SikhiThreads E-Commerce Platform - Initial Schema Migration
-- ============================================================

-- -------------------------------------------------------
-- 1. Utility: updated_at trigger function
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -------------------------------------------------------
-- 2. Tables
-- -------------------------------------------------------

-- products
CREATE TABLE products (
  id               uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  name             text          NOT NULL,
  slug             text          UNIQUE NOT NULL,
  description      text,
  short_description text,
  price            decimal(10,2) NOT NULL,
  compare_at_price decimal(10,2),
  currency         text          DEFAULT 'USD',
  category         text          NOT NULL CHECK (category IN ('wall_art','home_living','phone_tech','apparel','digital','books','custom')),
  subcategory      text,
  images           jsonb         DEFAULT '[]'::jsonb,
  variants         jsonb         DEFAULT '[]'::jsonb,
  is_digital       boolean       DEFAULT false,
  digital_file_url text,
  stock_quantity   integer       DEFAULT -1,
  is_featured      boolean       DEFAULT false,
  is_active        boolean       DEFAULT true,
  collection_tags  text[]        DEFAULT '{}',
  seo_title        text,
  seo_description  text,
  created_at       timestamptz   DEFAULT now(),
  updated_at       timestamptz   DEFAULT now()
);

-- collections
CREATE TABLE collections (
  id            uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  name          text          NOT NULL,
  slug          text          UNIQUE NOT NULL,
  description   text,
  image_url     text,
  is_active     boolean       DEFAULT true,
  display_order integer       DEFAULT 0,
  created_at    timestamptz   DEFAULT now(),
  updated_at    timestamptz   DEFAULT now()
);

-- order_number sequence starting at 1001
CREATE SEQUENCE orders_order_number_seq START WITH 1001;

-- orders
CREATE TABLE orders (
  id              uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number    integer       NOT NULL DEFAULT nextval('orders_order_number_seq'),
  customer_email  text          NOT NULL,
  customer_name   text          NOT NULL,
  customer_phone  text,
  shipping_address jsonb,
  billing_address  jsonb,
  items           jsonb         NOT NULL,
  subtotal        decimal(10,2) NOT NULL,
  shipping_cost   decimal(10,2) DEFAULT 0,
  discount        decimal(10,2) DEFAULT 0,
  tax             decimal(10,2) DEFAULT 0,
  total           decimal(10,2) NOT NULL,
  currency        text          DEFAULT 'USD',
  coupon_code     text,
  payment_method  text          CHECK (payment_method IN ('stripe','razorpay')),
  payment_id      text,
  payment_status  text          DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed','refunded')),
  order_status    text          DEFAULT 'pending' CHECK (order_status IN ('pending','confirmed','processing','shipped','delivered','cancelled')),
  tracking_number text,
  tracking_url    text,
  notes           text,
  created_at      timestamptz   DEFAULT now(),
  updated_at      timestamptz   DEFAULT now()
);

ALTER SEQUENCE orders_order_number_seq OWNED BY orders.order_number;

-- customers
CREATE TABLE customers (
  id               uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  email            text          UNIQUE NOT NULL,
  name             text,
  phone            text,
  addresses        jsonb         DEFAULT '[]'::jsonb,
  total_orders     integer       DEFAULT 0,
  total_spent      decimal(10,2) DEFAULT 0,
  email_subscribed boolean       DEFAULT true,
  created_at       timestamptz   DEFAULT now(),
  updated_at       timestamptz   DEFAULT now()
);

-- email_subscribers
CREATE TABLE email_subscribers (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  email           text        UNIQUE NOT NULL,
  name            text,
  source          text        DEFAULT 'website' CHECK (source IN ('website','checkout','lead_magnet')),
  is_active       boolean     DEFAULT true,
  subscribed_at   timestamptz DEFAULT now(),
  unsubscribed_at timestamptz
);

-- reviews
CREATE TABLE reviews (
  id             uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id     uuid        REFERENCES products(id) ON DELETE CASCADE,
  customer_name  text        NOT NULL,
  customer_email text        NOT NULL,
  rating         integer     NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title          text,
  body           text,
  image_urls     jsonb       DEFAULT '[]'::jsonb,
  is_approved    boolean     DEFAULT false,
  created_at     timestamptz DEFAULT now()
);

-- custom_orders
CREATE TABLE custom_orders (
  id               uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  name             text          NOT NULL,
  email            text          NOT NULL,
  phone            text,
  type             text          NOT NULL CHECK (type IN ('family_portrait','gurdwara','corporate','other')),
  description      text          NOT NULL,
  reference_images jsonb         DEFAULT '[]'::jsonb,
  budget_range     text,
  status           text          DEFAULT 'inquiry' CHECK (status IN ('inquiry','quoted','accepted','in_progress','completed','cancelled')),
  quoted_price     decimal(10,2),
  notes            text,
  created_at       timestamptz   DEFAULT now(),
  updated_at       timestamptz   DEFAULT now()
);

-- site_settings
CREATE TABLE site_settings (
  key        text        PRIMARY KEY,
  value      jsonb       NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- coupons
CREATE TABLE coupons (
  id               uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  code             text          UNIQUE NOT NULL,
  type             text          NOT NULL CHECK (type IN ('percentage','fixed')),
  value            decimal(10,2) NOT NULL,
  min_order_amount decimal(10,2) DEFAULT 0,
  usage_limit      integer,
  times_used       integer       DEFAULT 0,
  starts_at        timestamptz,
  expires_at       timestamptz,
  is_active        boolean       DEFAULT true,
  created_at       timestamptz   DEFAULT now()
);

-- -------------------------------------------------------
-- 3. updated_at triggers
-- -------------------------------------------------------
CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_custom_orders_updated_at
  BEFORE UPDATE ON custom_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -------------------------------------------------------
-- 4. Indexes
-- -------------------------------------------------------
CREATE INDEX idx_products_slug          ON products (slug);
CREATE INDEX idx_products_category      ON products (category);
CREATE INDEX idx_products_is_active     ON products (is_active);
CREATE INDEX idx_orders_order_number    ON orders (order_number);
CREATE INDEX idx_orders_customer_email  ON orders (customer_email);
CREATE INDEX idx_orders_order_status    ON orders (order_status);
CREATE INDEX idx_orders_payment_status  ON orders (payment_status);
CREATE INDEX idx_collections_slug       ON collections (slug);
CREATE INDEX idx_customers_email        ON customers (email);
CREATE INDEX idx_email_subscribers_email ON email_subscribers (email);
CREATE INDEX idx_reviews_product_id     ON reviews (product_id);
CREATE INDEX idx_coupons_code           ON coupons (code);

-- -------------------------------------------------------
-- 5. Row Level Security
-- -------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE products          ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections       ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders            ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews           ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_orders     ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons           ENABLE ROW LEVEL SECURITY;

-- Service role bypass policies (full access for backend/server)
CREATE POLICY service_all_products          ON products          FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY service_all_collections       ON collections       FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY service_all_orders            ON orders            FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY service_all_customers         ON customers         FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY service_all_email_subscribers ON email_subscribers FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY service_all_reviews           ON reviews           FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY service_all_custom_orders     ON custom_orders     FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY service_all_site_settings     ON site_settings     FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY service_all_coupons           ON coupons           FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Products: public can read active products
CREATE POLICY public_read_active_products
  ON products FOR SELECT TO anon, authenticated
  USING (is_active = true);

-- Collections: public can read active collections
CREATE POLICY public_read_active_collections
  ON collections FOR SELECT TO anon, authenticated
  USING (is_active = true);

-- Orders: public can read their own orders by email
CREATE POLICY public_read_own_orders
  ON orders FOR SELECT TO anon, authenticated
  USING (customer_email = current_setting('request.headers', true)::json->>'x-customer-email');

-- Reviews: public can read approved reviews
CREATE POLICY public_read_approved_reviews
  ON reviews FOR SELECT TO anon, authenticated
  USING (is_approved = true);

-- Reviews: public can insert reviews
CREATE POLICY public_insert_reviews
  ON reviews FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Email subscribers: public can insert
CREATE POLICY public_insert_email_subscribers
  ON email_subscribers FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Custom orders: public can insert
CREATE POLICY public_insert_custom_orders
  ON custom_orders FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Site settings: public can read
CREATE POLICY public_read_site_settings
  ON site_settings FOR SELECT TO anon, authenticated
  USING (true);

-- -------------------------------------------------------
-- 6. Seed Data: site_settings
-- -------------------------------------------------------
INSERT INTO site_settings (key, value) VALUES
  ('announcement_bar',        '"Free shipping on orders over $50 | Vaisakhi Collection Now Live"'),
  ('free_shipping_threshold',  '50'),
  ('hero_title',              '"Sikh Stories Woven in Thread"'),
  ('hero_subtitle',           '"Experience the beauty of Sikhi through handcrafted crochet art"'),
  ('contact_email',           '"hello@sikhithreads.com"'),
  ('instagram_url',           '"https://instagram.com/sikhithreads"');

-- -------------------------------------------------------
-- 7. Seed Data: collections
-- -------------------------------------------------------
INSERT INTO collections (name, slug, is_active, display_order) VALUES
  ('Vaisakhi Collection', 'vaisakhi',           true, 1),
  ('Wall Art',            'wall-art',            true, 2),
  ('Digital Downloads',   'digital-downloads',   true, 3),
  ('Home & Living',       'home-living',         true, 4);

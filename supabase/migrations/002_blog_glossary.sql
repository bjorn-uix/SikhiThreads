-- ============================================================
-- MIGRATION 002: Blog Posts & Glossary Terms
-- ============================================================

-- ─── Blog Posts Table ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL,
  cover_image text,
  author text DEFAULT 'SikhiThreads',
  category text CHECK (category IN ('sikh-history', 'culture', 'festivals', 'art', 'guides', 'news')),
  tags text[] DEFAULT '{}',
  is_published boolean DEFAULT false,
  published_at timestamptz,
  seo_title text,
  seo_description text,
  seo_keywords text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ─── Glossary Terms Table ────────────────────────────────────

CREATE TABLE IF NOT EXISTS glossary_terms (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  term text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  definition text NOT NULL,
  pronunciation text,
  category text CHECK (category IN ('beliefs', 'practices', 'people', 'places', 'scripture', 'festivals', 'symbols', 'general')),
  related_terms text[] DEFAULT '{}',
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ─── Indexes ─────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);

CREATE INDEX IF NOT EXISTS idx_glossary_terms_slug ON glossary_terms(slug);
CREATE INDEX IF NOT EXISTS idx_glossary_terms_category ON glossary_terms(category);
CREATE INDEX IF NOT EXISTS idx_glossary_terms_is_published ON glossary_terms(is_published);

-- ─── Updated_at Triggers ─────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blog_posts_updated_at ON blog_posts;
CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS glossary_terms_updated_at ON glossary_terms;
CREATE TRIGGER glossary_terms_updated_at
  BEFORE UPDATE ON glossary_terms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Row Level Security ──────────────────────────────────────

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE glossary_terms ENABLE ROW LEVEL SECURITY;

-- Public: anyone can read published posts
CREATE POLICY "Public can read published blog posts"
  ON blog_posts FOR SELECT
  USING (is_published = true);

-- Public: anyone can read published glossary terms
CREATE POLICY "Public can read published glossary terms"
  ON glossary_terms FOR SELECT
  USING (is_published = true);

-- Service role: full access to blog_posts
CREATE POLICY "Service role full access blog_posts"
  ON blog_posts FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Service role: full access to glossary_terms
CREATE POLICY "Service role full access glossary_terms"
  ON glossary_terms FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ─── Grants ──────────────────────────────────────────────────

GRANT SELECT ON blog_posts TO anon;
GRANT SELECT ON blog_posts TO authenticated;
GRANT ALL ON blog_posts TO service_role;

GRANT SELECT ON glossary_terms TO anon;
GRANT SELECT ON glossary_terms TO authenticated;
GRANT ALL ON glossary_terms TO service_role;

-- ─── Notify PostgREST ────────────────────────────────────────

NOTIFY pgrst, 'reload schema';

-- ============================================================
-- SEED DATA: Blog Posts
-- ============================================================

INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, author, category, tags, is_published, published_at, seo_title, seo_description, seo_keywords) VALUES

-- 1. Vaisakhi
(
  'What is Vaisakhi? The Complete Guide to the Sikh New Year',
  'what-is-vaisakhi',
  'Vaisakhi is one of the most important dates in the Sikh calendar — the day Guru Gobind Singh Ji created the Khalsa. Here''s everything you need to know.',
  '<h2>What is Vaisakhi?</h2>
<p>Vaisakhi (also spelled Baisakhi) is one of the most significant and joyous celebrations in the Sikh calendar. Observed on April 13 or 14 each year, Vaisakhi marks the founding of the Khalsa — the collective body of initiated Sikhs — by Guru Gobind Singh Ji in 1699. It is a day of immense spiritual pride, community celebration, and cultural renewal for Sikhs around the world.</p>
<p>While Vaisakhi also coincides with the traditional harvest festival in Punjab, its spiritual significance for Sikhs goes far deeper. It is the day that defined Sikh identity and gave the community its distinct form, values, and commitment to justice and equality.</p>

<h2>When is Vaisakhi 2026?</h2>
<p>In 2026, Vaisakhi falls on <strong>Monday, April 13</strong>. Celebrations often extend over the full weekend, with Gurdwaras hosting special programs, Nagar Kirtans (street processions), and community gatherings in the days surrounding the holiday.</p>
<p>Mark your calendar and plan to join the celebrations at your local Gurdwara or community center. It is truly one of the most uplifting days of the year.</p>

<h2>The Historical Significance of Vaisakhi</h2>
<p>To understand why Vaisakhi holds such an important place in Sikh hearts, we need to go back to the spring of 1699 in Anandpur Sahib, Punjab.</p>
<p>Guru Gobind Singh Ji, the tenth Sikh Guru, called upon Sikhs from across the land to gather for Vaisakhi. Before a crowd of thousands, Guru Sahib stood with a drawn sword and asked for volunteers willing to give their heads — to sacrifice their lives — for their faith.</p>
<p>One by one, five brave Sikhs stepped forward. Each was taken into a tent, and Guru Sahib emerged each time with a bloodied sword. The tension and fear in the crowd were immense. But then all five emerged alive, dressed in new robes and turbans. They had been tested — and their courage had been proven.</p>

<h3>The Panj Pyare: The Five Beloved Ones</h3>
<p>These five courageous Sikhs became known as the <strong>Panj Pyare</strong> — the Five Beloved Ones. They were:</p>
<ul>
<li><strong>Bhai Daya Singh</strong> — from Lahore (now in Pakistan)</li>
<li><strong>Bhai Dharam Singh</strong> — from Hastinapur, Uttar Pradesh</li>
<li><strong>Bhai Himmat Singh</strong> — from Puri, Odisha</li>
<li><strong>Bhai Mohkam Singh</strong> — from Dwarka, Gujarat</li>
<li><strong>Bhai Sahib Singh</strong> — from Bidar, Karnataka</li>
</ul>
<p>Notice something powerful: these five Sikhs came from completely different regions and backgrounds of India. This was no accident. Guru Gobind Singh Ji demonstrated that Sikhi transcends all boundaries of caste, class, region, and social status. The Khalsa belongs to everyone.</p>
<p>Guru Sahib then prepared Amrit (the nectar of immortality) in an iron bowl, stirring it with a double-edged sword while reciting sacred Bani. The Panj Pyare were the first to be initiated into the Khalsa through the Amrit ceremony. And then, in a revolutionary act, Guru Gobind Singh Ji himself asked the Panj Pyare to administer Amrit to him — showing that the Guru was not above the Khalsa, but part of it.</p>

<h2>The Khalsa: A New Identity</h2>
<p>With the creation of the Khalsa, Guru Gobind Singh Ji gave Sikhs a distinct identity. Initiated Sikhs were given the surname <strong>Singh</strong> (meaning lion) for men and <strong>Kaur</strong> (meaning princess or sovereign) for women. This was a direct challenge to the caste system, which used surnames to identify social status.</p>
<p>The Khalsa was given a code of conduct and the five articles of faith known as the <strong>Panj Kakaar</strong> (Five Ks): Kesh (uncut hair), Kangha (wooden comb), Kara (steel bracelet), Kachera (cotton undergarment), and Kirpan (ceremonial sword). Each article carries deep spiritual meaning and serves as a daily reminder of the Sikh''s commitment to their faith.</p>

<h2>How is Vaisakhi Celebrated?</h2>
<p>Vaisakhi celebrations are vibrant, joyful, and deeply communal. Here are some of the main ways Sikhs celebrate around the world:</p>

<h3>Nagar Kirtan (Street Processions)</h3>
<p>One of the most visible celebrations is the <strong>Nagar Kirtan</strong> — a colorful street procession that flows through neighborhoods and city streets. Led by the Panj Pyare in their traditional blue or saffron robes, the procession includes the Guru Granth Sahib carried on a beautifully decorated float, live Kirtan (devotional music), martial arts displays (Gatka), and free food and drinks distributed to everyone along the route.</p>
<p>Nagar Kirtans are a spectacular sight — thousands of people walking together in unity, with the sound of Gurbani filling the air. They take place in cities worldwide, from Toronto and Vancouver to London, New York, and Los Angeles. Our <strong>Nagar Kirtan Procession art print</strong> captures the energy and beauty of this tradition.</p>

<h3>Gurdwara Celebrations</h3>
<p>Gurdwaras hold extended programs on Vaisakhi, including Akhand Path (continuous reading of the Guru Granth Sahib), special Kirtan programs, lectures on Sikh history, and Amrit Sanchar ceremonies where new members are initiated into the Khalsa.</p>

<h3>Langar: The Great Equalizer</h3>
<p>No Sikh celebration is complete without <strong>Langar</strong> — the communal free kitchen. On Vaisakhi, Gurdwaras prepare massive feasts for the entire community and any visitors. Everyone sits together on the floor and eats the same food, regardless of background. It is a beautiful expression of the Sikh values of equality and selfless service (Seva).</p>

<h3>Bhangra and Cultural Programs</h3>
<p>Vaisakhi also coincides with the Punjabi harvest festival, so celebrations often include lively Bhangra and Giddha dances, cultural performances, and community fairs. It is a time of pure joy and celebration of Punjabi heritage.</p>

<h2>Vaisakhi Around the World</h2>
<p>Today, Vaisakhi is celebrated by millions of Sikhs across the globe. Some of the largest celebrations include:</p>
<ul>
<li><strong>Anandpur Sahib, India</strong> — The birthplace of the Khalsa, where the original Vaisakhi took place. Hundreds of thousands gather here each year.</li>
<li><strong>Surrey/Vancouver, Canada</strong> — Home to one of the largest Sikh diaspora populations, the Nagar Kirtan here draws over 500,000 attendees annually.</li>
<li><strong>London, United Kingdom</strong> — Southall hosts a massive Nagar Kirtan through its vibrant Punjabi community.</li>
<li><strong>New York / Los Angeles, USA</strong> — Growing Sikh communities organize beautiful processions and celebrations.</li>
<li><strong>Melbourne / Sydney, Australia</strong> — The Australian Sikh community has grown significantly, with large Vaisakhi celebrations each year.</li>
</ul>

<h2>Celebrating Vaisakhi with SikhiThreads</h2>
<p>At SikhiThreads, Vaisakhi holds a special place in our hearts. It is a celebration of courage, identity, and the revolutionary spirit of Sikhi. Our <strong>Vaisakhi Collection</strong> captures the joy and pride of this celebration through art that you can bring into your home.</p>
<p>From the vibrant colors of Nagar Kirtan processions to the solemnity of the Amrit ceremony, our artwork aims to honor the beauty and depth of this sacred day. Whether you are looking for a piece to display during Vaisakhi celebrations or a meaningful gift for a loved one, our collection is designed with love and reverence.</p>

<h2>What Does Vaisakhi Mean for Sikhs Today?</h2>
<p>Vaisakhi is not just a historical event — it is a living, breathing reminder of what it means to be a Sikh. It reminds us of the courage of the Panj Pyare, the revolutionary vision of Guru Gobind Singh Ji, and the values of equality, justice, and service that define the Khalsa.</p>
<p>Every year, as Vaisakhi comes around, Sikhs renew their commitment to these values. It is a time to reflect on our identity, celebrate our heritage, and share the beautiful message of Sikhi with the world.</p>
<p>Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh!</p>',
  NULL,
  'SikhiThreads',
  'festivals',
  ARRAY['vaisakhi', 'khalsa', 'sikh-festivals', 'guru-gobind-singh'],
  true,
  now(),
  'What is Vaisakhi? Complete Guide to the Sikh New Year Festival 2026',
  'Learn everything about Vaisakhi — the Sikh New Year and celebration of the Khalsa. History, traditions, how it''s celebrated, and its significance in Sikhi.',
  'what is vaisakhi, vaisakhi 2026, sikh new year, khalsa, vaisakhi celebration, when is vaisakhi'
),

-- 2. Golden Temple
(
  'The Golden Temple — Harmandir Sahib Through the Eyes of Art',
  'golden-temple-harmandir-sahib',
  'Discover the history, architecture, and spiritual significance of the Golden Temple — the holiest shrine in Sikhi and a beacon of equality for all humanity.',
  '<h2>The Golden Temple: A Beacon of Faith and Equality</h2>
<p>There are few places on earth as breathtaking as <strong>Sri Harmandir Sahib</strong> — known to many as the Golden Temple. Situated in the heart of Amritsar, Punjab, this magnificent Gurdwara is the spiritual and cultural center of Sikhi. With its gleaming gold-plated exterior reflected in the sacred Sarovar (pool of nectar), the Golden Temple is not just an architectural marvel — it is a living embodiment of the Sikh values of devotion, equality, and service.</p>
<p>Every year, millions of visitors from all faiths and backgrounds walk through its doors, drawn by its beauty, its message, and the warmth of its community. There is no VIP entrance, no reserved section, no hierarchy. Everyone is equal at Harmandir Sahib.</p>

<h2>The History of Harmandir Sahib</h2>
<p>The story of the Golden Temple begins with <strong>Guru Ram Das Ji</strong>, the fourth Sikh Guru, who founded the city of Amritsar in the 1570s. He began the excavation of the sacred pool (Amrit Sarovar — the Pool of Nectar) that gives the city its name.</p>
<p>His successor, <strong>Guru Arjan Dev Ji</strong>, the fifth Guru, oversaw the construction of Harmandir Sahib in the center of the Sarovar. In a profoundly symbolic gesture, Guru Arjan Dev Ji invited the Sufi Muslim saint <strong>Mian Mir</strong> to lay the foundation stone of the temple. This act demonstrated that the House of God was for all of humanity, not just one faith.</p>
<p>The construction was completed in 1604, and Guru Arjan Dev Ji installed the <strong>Adi Granth</strong> — the first compilation of Sikh scripture — in the temple, establishing it as the central place of worship for Sikhs.</p>

<h3>The Four Entrances</h3>
<p>One of the most significant architectural features of Harmandir Sahib is that it has <strong>four entrances</strong> — one on each side. This symbolizes that the temple is open to people from all four directions, all four castes, all faiths, and all walks of life. There are no barriers to entry. This was a revolutionary statement in a society deeply divided by caste and religion.</p>

<h2>Architecture and Design</h2>
<p>The Golden Temple is a stunning fusion of Hindu and Islamic architectural styles, reflecting Guru Arjan Dev Ji''s vision of unity and harmony. The lower levels are built in white marble, intricately carved with floral and geometric patterns. The upper levels are covered in gold leaf — a addition made by Maharaja Ranjit Singh in the early 19th century, which gave the temple its iconic golden glow.</p>
<p>The temple sits on a 67-foot square platform in the middle of the Sarovar, connected to the parikrama (walkway) by a 60-foot causeway. The reflection of the golden structure in the still waters of the Sarovar creates one of the most photographed and painted scenes in the world.</p>
<p>Inside, the Guru Granth Sahib is placed on a throne under a jeweled canopy, and continuous Kirtan (devotional music) fills the air from early morning until late at night. The sound of Gurbani reverberating across the Sarovar is an experience that stays with you forever.</p>

<h2>Daily Life at the Golden Temple</h2>
<p>Harmandir Sahib is not a museum or a monument — it is a living, breathing place of worship. The daily routine begins at Amrit Vela (the early morning hours before dawn) with the ceremonial opening of the Guru Granth Sahib and continues until late at night with the closing ceremony (Sukhasan).</p>
<p>Throughout the day, thousands of visitors and devotees participate in:</p>
<ul>
<li><strong>Darshan</strong> — Paying respects to the Guru Granth Sahib</li>
<li><strong>Kirtan</strong> — Listening to the continuous devotional music performed by Ragis</li>
<li><strong>Ishnaan</strong> — Taking a dip in the sacred Sarovar</li>
<li><strong>Langar</strong> — Eating in the world''s largest free community kitchen</li>
<li><strong>Seva</strong> — Volunteering in the kitchen, cleaning, or other community service</li>
</ul>

<h3>The Langar at Golden Temple</h3>
<p>The Langar at Harmandir Sahib is one of the most extraordinary institutions in the world. Operating 24 hours a day, 7 days a week, it feeds an estimated <strong>50,000 to 100,000 people every single day</strong> — completely free of charge. The entire operation is run by volunteers (Sevadars) who cook, serve, and clean as an act of devotion and service.</p>
<p>Everyone — regardless of faith, caste, nationality, or social status — sits on the floor together and eats the same simple, wholesome vegetarian food. It is equality in action, and it is one of the most moving experiences you can have at the Golden Temple.</p>

<h2>The Golden Temple Through Art</h2>
<p>Artists have been inspired by Harmandir Sahib for centuries. Its golden domes reflecting in the Sarovar at dawn, the warm glow of evening lights, the devotion on the faces of worshippers — these are scenes that beg to be captured and shared.</p>
<p>At SikhiThreads, we are deeply inspired by the beauty and spirit of the Golden Temple. Our artwork captures different moods and moments of Harmandir Sahib — from the peaceful dawn light to the vibrant energy of a busy day. Each piece is created with reverence and love, designed to bring a piece of this sacred space into your home.</p>
<p>Our <strong>Golden Temple at Dawn canvas wrap</strong> captures that magical moment when the first light of day illuminates the gold and creates a perfect mirror image in the Sarovar. It is one of our most beloved pieces and a beautiful addition to any Sikh home.</p>

<h2>Visiting the Golden Temple</h2>
<p>If you have never visited Harmandir Sahib, it should be at the top of your list. Here are some tips for first-time visitors:</p>
<ul>
<li>Cover your head before entering the complex — scarves are available at the entrance.</li>
<li>Remove your shoes and wash your feet at the designated areas.</li>
<li>Walk clockwise around the Sarovar on the parikrama.</li>
<li>Join the Langar — it is an experience that will humble and inspire you.</li>
<li>Visit at different times of day — the temple is stunning at dawn, during the day, and especially at night when it is lit up.</li>
<li>Consider doing Seva (volunteer service) during your visit. Even a few hours of serving food in the Langar or helping with cleaning will make your trip unforgettable.</li>
</ul>

<h2>A Symbol of Resilience</h2>
<p>The Golden Temple has endured periods of persecution and destruction throughout its history. It has been attacked and damaged multiple times, only to be rebuilt by the Sikh community with even greater determination. This resilience is a testament to the unbreakable spirit of the Sikh people and their deep connection to this sacred place.</p>
<p>Today, Harmandir Sahib stands as a beacon of hope, equality, and devotion — a place where the doors are always open, the food is always free, and every person is welcomed as a child of God.</p>',
  NULL,
  'SikhiThreads',
  'sikh-history',
  ARRAY['golden-temple', 'harmandir-sahib', 'amritsar', 'sikh-history'],
  true,
  now(),
  'The Golden Temple (Harmandir Sahib) — History, Significance & Art',
  'Explore the history, architecture, and spiritual significance of the Golden Temple (Harmandir Sahib) in Amritsar — the holiest shrine in Sikhi.',
  'golden temple, harmandir sahib, golden temple history, amritsar, sikh temple'
),

-- 3. Guru Nanak Dev Ji
(
  'Guru Nanak Dev Ji — The Founder of Sikhi and His Timeless Teachings',
  'guru-nanak-dev-ji',
  'Explore the life, travels, and revolutionary teachings of Guru Nanak Dev Ji — the founder of Sikhi whose message of equality and oneness still resonates today.',
  '<h2>Who Was Guru Nanak Dev Ji?</h2>
<p><strong>Guru Nanak Dev Ji</strong> (1469-1539) is the founder of Sikhi and the first of the ten Sikh Gurus. Born in the village of Rai Bhoi di Talwandi (now Nankana Sahib, Pakistan), Guru Nanak challenged the rigid social structures, religious rituals, and inequalities of his time with a message that was revolutionary in its simplicity: there is one God, and all human beings are equal.</p>
<p>From a young age, Nanak showed extraordinary spiritual awareness. Stories of his childhood describe a boy who questioned empty rituals, saw beyond caste divisions, and felt a deep connection with the divine. When he was about 30 years old, Guru Nanak had a profound spiritual experience that transformed his life and set him on his mission.</p>

<h2>The Divine Revelation</h2>
<p>The story goes that Guru Nanak went to bathe in the river Vein and disappeared for three days. When he re-emerged, he was filled with divine light and spoke these words: <strong>"There is no Hindu, there is no Muslim."</strong> This was not a rejection of either faith, but a declaration that the labels and divisions humans create are meaningless before God. What matters is truth, compassion, and honest living.</p>
<p>This moment marked the beginning of Guru Nanak''s mission to share the message of Sikhi with the world.</p>

<h2>The Udasis: Guru Nanak''s Great Journeys</h2>
<p>Guru Nanak spent approximately 24 years traveling across South Asia, the Middle East, and Central Asia on journeys known as <strong>Udasis</strong>. Accompanied by his devoted companion <strong>Bhai Mardana</strong>, a Muslim musician, Guru Nanak visited Hindu temples, Muslim mosques, Buddhist monasteries, and Sufi shrines — engaging with people of all faiths and backgrounds.</p>

<h3>The First Udasi (East)</h3>
<p>Guru Nanak traveled through modern-day India, visiting major cities and holy sites. He engaged with Hindu priests, challenged the caste system, and shared his message of equality. A famous story from this journey involves Guru Nanak in Haridwar, where he found people throwing water toward the sun as an offering to their ancestors. Guru Nanak began throwing water in the opposite direction. When questioned, he said he was watering his fields in Punjab. If their water could reach the sun, surely his could reach Punjab. The point was made — blind ritual without understanding is meaningless.</p>

<h3>The Second Udasi (South)</h3>
<p>Guru Nanak traveled to Sri Lanka and southern India, engaging with different spiritual traditions and communities. Everywhere he went, he left behind communities of followers (Sangats) who would gather to sing hymns and share meals together.</p>

<h3>The Third Udasi (North)</h3>
<p>Guru Nanak traveled to the Himalayan regions, visiting Tibet and other mountainous areas. He engaged with yogis and ascetics, teaching that true spirituality does not require withdrawal from the world but active engagement with it.</p>

<h3>The Fourth Udasi (West)</h3>
<p>Perhaps the most remarkable journey took Guru Nanak to Mecca, Medina, and Baghdad. In Mecca, a famous story tells of Guru Nanak sleeping with his feet pointed toward the Kaaba. When a caretaker scolded him and moved his feet, the Kaaba appeared in that direction too — illustrating that God is everywhere, not limited to one direction or one place.</p>

<h2>The Core Teachings of Guru Nanak</h2>
<p>Guru Nanak''s teachings form the foundation of Sikhi. They are remarkably relevant even today, over 500 years later.</p>

<h3>Ik Onkar — One God</h3>
<p>The most fundamental teaching of Guru Nanak is the oneness of God. The <strong>Mool Mantar</strong>, the opening verse of the Guru Granth Sahib, begins with "Ik Onkar" — there is One Creator. This God is formless, timeless, self-existent, and accessible to all. There is no need for intermediaries — every person can connect with the divine directly through love and devotion.</p>

<h3>Naam Japna — Meditation on God''s Name</h3>
<p>Guru Nanak taught that remembering God (Naam Simran) should be a part of daily life. This is not about mechanical repetition but about cultivating a constant awareness of the divine presence in everything around us.</p>

<h3>Kirat Karni — Honest Work</h3>
<p>Guru Nanak emphasized the importance of earning an honest living through hard work. He rejected the idea that spiritual life requires withdrawal from the world. A Sikh should be a householder who works honestly, supports their family, and contributes to society.</p>

<h3>Vand Chakna — Sharing with Others</h3>
<p>The third pillar of Guru Nanak''s teachings is sharing what you have with those in need. This principle is embodied in the institution of <strong>Langar</strong>, which Guru Nanak himself established — a free communal kitchen where everyone sits together and eats regardless of background.</p>

<h3>Equality of All People</h3>
<p>Guru Nanak was a fierce advocate for equality. He rejected the caste system, spoke against the subjugation of women, and taught that all human beings — regardless of religion, caste, gender, or social status — are equal in the eyes of God. His famous hymn declares: "Recognize the divine light in all, and do not ask for anyone''s caste. There is no caste in the hereafter."</p>

<h2>Kartarpur: Guru Nanak''s Legacy</h2>
<p>After his years of travel, Guru Nanak settled in <strong>Kartarpur</strong> (now in Pakistan), where he established a community based on his teachings. Here, he lived as a farmer, demonstrated the principles of honest work, daily devotion, and community service. Kartarpur became the model for all future Sikh communities.</p>
<p>Before his passing in 1539, Guru Nanak appointed <strong>Guru Angad Dev Ji</strong> as his successor, establishing the line of Sikh Gurus that would continue through ten human Gurus before the eternal Guruship was bestowed upon the Guru Granth Sahib.</p>

<h2>Guru Nanak in Art and Culture</h2>
<p>Guru Nanak''s image — often depicted with a serene face, white beard, and a halo of light — is one of the most recognizable icons in Sikh culture. Artists have portrayed his life and teachings in countless paintings, murals, and modern artwork.</p>
<p>At SikhiThreads, our <strong>Guru Nanak Dev Ji art print</strong> captures the warmth, wisdom, and divine light of the first Guru. It is a beautiful piece for any Sikh home and a daily reminder of the timeless values that Guru Nanak gave to the world.</p>

<h2>Guru Nanak''s Message for Today</h2>
<p>In a world often divided by religion, race, and politics, Guru Nanak''s message is more relevant than ever. His call for universal equality, honest living, compassion, and service to humanity transcends time and borders. Whether you are a Sikh or simply someone seeking truth and meaning, Guru Nanak''s teachings offer a path of love, humility, and connection with the divine.</p>
<p>Dhan Guru Nanak Dev Ji.</p>',
  NULL,
  'SikhiThreads',
  'sikh-history',
  ARRAY['guru-nanak', 'sikh-gurus', 'sikh-history', 'sikh-teachings'],
  true,
  now(),
  'Guru Nanak Dev Ji — The Founder of Sikhi and His Timeless Teachings',
  'Explore the life, travels, and revolutionary teachings of Guru Nanak Dev Ji — the founder of Sikhi whose message of equality and oneness still resonates today.',
  'guru nanak, guru nanak dev ji, founder of sikhism, guru nanak teachings'
),

-- 4. What is Langar
(
  'What is Langar? The World''s Largest Free Kitchen and Its Beautiful Message',
  'what-is-langar',
  'Langar is the Sikh tradition of serving free meals to everyone, regardless of background. Discover the origin, meaning, and impact of this powerful institution.',
  '<h2>What is Langar?</h2>
<p><strong>Langar</strong> is the Sikh tradition of serving free, communal meals to all people regardless of religion, caste, gender, social status, or wealth. Found in every Gurdwara (Sikh place of worship) around the world, Langar is one of the most powerful and practical expressions of the Sikh values of equality, humility, and selfless service (Seva).</p>
<p>The word "Langar" comes from the Persian word for "anchor" or "resting place," and it truly serves as an anchor of community life. It is not charity in the traditional sense — it is an institution that declares, through action rather than words, that all human beings are equal and deserve to be fed with dignity.</p>

<h2>The Origins of Langar</h2>
<p>Langar was established by <strong>Guru Nanak Dev Ji</strong>, the founder of Sikhi, in the 15th century. According to tradition, when Guru Nanak was a young man, his father gave him money to make a good business deal. Instead, Guru Nanak used the money to feed a group of hungry sadhus (holy men). When his father questioned him, Guru Nanak replied that there was no better deal than feeding the hungry — this was "true business" (Sacha Sauda).</p>
<p>This act of feeding the hungry became the foundation of Langar. Guru Nanak established the practice at Kartarpur, where his community would gather daily to eat together before worship. The message was clear: if you cannot sit together and eat as equals, how can you worship together as equals?</p>

<h3>Guru Amar Das Ji and the Rule of Pangat</h3>
<p>The third Guru, <strong>Guru Amar Das Ji</strong>, strengthened the institution of Langar by establishing the rule: <strong>"Pehle Pangat, Phir Sangat"</strong> — first sit together and eat (Pangat), then sit together and worship (Sangat). Everyone, from emperors to common people, had to sit on the floor and eat the same food before they could seek an audience with the Guru.</p>
<p>The most famous example of this is when the Mughal Emperor <strong>Akbar</strong> visited Guru Amar Das Ji. Despite being the most powerful man in India, Akbar was required to sit on the floor and eat Langar with everyone else before meeting the Guru. Akbar was so moved by the experience that he offered a grant of land for the Langar, but the Guru declined — Langar runs on the offerings and service of the community, not on patronage of the wealthy.</p>

<h2>How Does Langar Work?</h2>
<p>Langar is entirely volunteer-run. Every aspect — from cooking to serving to cleaning — is performed by <strong>Sevadars</strong> (volunteers) as an act of devotion and humble service.</p>

<h3>The Kitchen</h3>
<p>In a typical Gurdwara kitchen, volunteers work in shifts to prepare simple, nutritious vegetarian food. Common dishes include dal (lentils), roti (flatbread), rice, sabzi (vegetable curry), and kheer (rice pudding) for dessert. The food is always vegetarian to ensure that everyone, regardless of dietary restrictions, can eat.</p>

<h3>The Dining Hall</h3>
<p>In the Langar hall, everyone sits together on the floor in rows — this is called <strong>Pangat</strong>. There are no tables, no chairs, no reserved seats. A king sits next to a laborer, a CEO next to a homeless person. Volunteers walk through the rows serving food, and no one leaves hungry.</p>

<h3>The Cleanup</h3>
<p>After eating, visitors are encouraged to wash their own plates and help clean up. This is considered an act of Seva and humility — no task is too lowly, and no person is above doing dishes.</p>

<h2>Langar by the Numbers</h2>
<p>The scale of Langar around the world is staggering:</p>
<ul>
<li><strong>The Golden Temple (Harmandir Sahib)</strong> in Amritsar serves an estimated 50,000 to 100,000 meals every single day, making it the largest free kitchen in the world.</li>
<li>On special occasions like Vaisakhi or Gurpurab, the numbers can exceed 200,000 meals in a single day.</li>
<li>There are Gurdwaras in virtually every major city in the world, each running its own Langar program.</li>
<li>During crises — natural disasters, pandemics, humanitarian emergencies — Sikh organizations are often among the first to set up Langar operations to feed affected communities.</li>
</ul>

<h2>Langar Beyond the Gurdwara</h2>
<p>In recent years, the spirit of Langar has extended far beyond the walls of the Gurdwara. Sikh organizations around the world have taken Langar to the streets, feeding the homeless, disaster victims, and anyone in need.</p>
<ul>
<li><strong>Khalsa Aid</strong> has provided food and relief in disaster zones around the world, from Syrian refugee camps to earthquake-affected regions.</li>
<li><strong>Midland Langar Seva Society</strong> in the UK feeds thousands of homeless people each week in cities across Britain.</li>
<li>During the COVID-19 pandemic, Sikh communities worldwide organized massive Langar drives to feed frontline workers and families in need.</li>
<li>In the United States, Sikh organizations regularly set up Langar at food banks, homeless shelters, and community events.</li>
</ul>

<h2>The Deeper Meaning of Langar</h2>
<p>Langar is more than just free food. It is a spiritual practice that teaches humility, equality, and community. When you sit on the floor and eat the same simple food as everyone around you, something shifts inside. The ego softens. The walls we build between ourselves and others begin to dissolve.</p>
<p>Guru Nanak understood that hunger and inequality are not just material problems — they are spiritual ones. By feeding people together as equals, Langar addresses both. It feeds the body and nourishes the soul.</p>

<h2>Langar and SikhiThreads</h2>
<p>At SikhiThreads, Langar is one of the values closest to our hearts. Our <strong>Langar: Everyone is Equal art print</strong> captures the beauty of this institution — people of all backgrounds sitting together, sharing a meal, and experiencing the simple truth that we are all one.</p>
<p>Every time you look at this piece, may it remind you that the most powerful act of worship is service to others.</p>

<h2>Experience Langar Yourself</h2>
<p>If you have never experienced Langar, we encourage you to visit your local Gurdwara. You do not need to be Sikh. You do not need an invitation. Simply cover your head, remove your shoes, and walk in. You will be welcomed, fed, and treated as family. That is the beauty of Langar — it is for everyone.</p>',
  NULL,
  'SikhiThreads',
  'culture',
  ARRAY['langar', 'seva', 'equality', 'gurdwara'],
  true,
  now(),
  'What is Langar? The World''s Largest Free Kitchen & Its Message of Equality',
  'Discover Langar — the Sikh tradition of free communal meals for everyone. Learn about its origins, how it works, and why it is the world''s largest free kitchen.',
  'langar, sikh langar, free kitchen, guru ka langar, sikh community kitchen'
),

-- 5. Sikh Art Decorating Guide
(
  'Sikh Art for Your Home — A Complete Decorating Guide',
  'sikh-art-home-decorating-guide',
  'Transform your living space with meaningful Sikh art. A room-by-room guide to choosing, placing, and styling Sikh artwork in your home.',
  '<h2>Bringing Sikhi Into Your Home Through Art</h2>
<p>Your home is more than just a living space — it is a reflection of who you are, what you value, and what brings you peace. For many Sikh families, surrounding themselves with art that reflects their faith and heritage is a way to keep the teachings of the Gurus alive in daily life. Sikh art serves as a constant reminder of the values we hold dear: devotion, equality, service, and courage.</p>
<p>Whether you are decorating a new home or refreshing an existing space, this guide will help you choose and display Sikh art that is both meaningful and beautiful.</p>

<h2>Choosing the Right Sikh Art</h2>
<p>Sikh art comes in many forms — from traditional Tanjore-style paintings and calligraphy to modern interpretations and digital art. When choosing art for your home, consider what resonates most with your family.</p>

<h3>Types of Sikh Art</h3>
<ul>
<li><strong>Portraits of the Gurus</strong> — Classic depictions of the ten Sikh Gurus. These are the most common form of Sikh art and carry deep spiritual significance.</li>
<li><strong>Gurdwara and Historical Scenes</strong> — Artwork depicting the Golden Temple, historical events, or sacred sites.</li>
<li><strong>Calligraphy and Gurbani Art</strong> — Beautiful renderings of Sikh prayers and scripture, such as the Mool Mantar or Japji Sahib.</li>
<li><strong>Cultural and Community Scenes</strong> — Art depicting Langar, Nagar Kirtan, Bhangra, and other aspects of Sikh life.</li>
<li><strong>Modern and Abstract Interpretations</strong> — Contemporary artists are creating stunning modern takes on Sikh themes, blending traditional symbolism with modern aesthetics.</li>
</ul>

<h2>Room-by-Room Guide</h2>

<h3>Living Room: The Heart of Your Home</h3>
<p>The living room is where your family gathers and guests are welcomed. This is the perfect space for a statement piece that reflects your faith and heritage. Consider a large canvas wrap of the Golden Temple or a beautifully framed portrait of Guru Nanak Dev Ji as a focal point above your sofa or mantel.</p>
<p>Our <strong>Golden Temple at Dawn canvas wrap</strong> makes a stunning centerpiece for any living room. The warm golden tones complement most interior styles, from traditional to modern.</p>
<p><strong>Tips:</strong></p>
<ul>
<li>Choose a larger piece (24x36 inches or larger) for impact.</li>
<li>Position it at eye level — typically 57-60 inches from the floor to the center of the artwork.</li>
<li>Use soft, warm lighting to highlight the piece and create a reverent atmosphere.</li>
<li>Consider gallery walls with 3-5 smaller pieces arranged together for a curated look.</li>
</ul>

<h3>Prayer Room / Meditation Space</h3>
<p>If you have a dedicated prayer room or meditation space, this is the most sacred spot in your home. Art here should be chosen with deep intention and reverence.</p>
<p>Gurbani calligraphy — such as the <strong>Mool Mantar</strong> or <strong>Japji Sahib</strong> — is perfect for a prayer room. The written word of the Guru creates an atmosphere of devotion and focus.</p>
<p><strong>Tips:</strong></p>
<ul>
<li>Keep the space simple and uncluttered — let the art and the Guru''s words be the focus.</li>
<li>Use calming colors and natural materials in the surrounding decor.</li>
<li>Place art at or slightly above eye level from a seated position.</li>
<li>Consider adding a small shelf beneath for a candle or fresh flowers.</li>
</ul>

<h3>Bedroom: Peaceful and Personal</h3>
<p>The bedroom is your personal sanctuary. Choose art that brings you peace and starts your day with inspiration. A serene landscape of the Golden Temple at dawn or a gentle portrait of Guru Nanak can set a calming tone for the space.</p>
<p>Our <strong>Amrit Vela (Morning Prayer) art print</strong> is a beautiful choice for the bedroom — it captures the quiet devotion of the early morning hours and serves as a gentle reminder to start each day with gratitude.</p>

<h3>Entryway and Hallway</h3>
<p>The entryway sets the tone for your entire home. A piece of Sikh art near the front door tells visitors about your values before you say a word.</p>
<p>Consider a Nishan Sahib (Sikh flag) art piece, a vibrant Vaisakhi celebration print, or a welcoming Ik Onkar calligraphy near the entrance.</p>

<h3>Kids'' Room</h3>
<p>Introducing children to Sikh art from an early age helps build a connection with their heritage. Choose colorful, age-appropriate artwork that tells stories — the Panj Pyare, scenes from Guru Nanak''s travels, or a fun Vaisakhi celebration.</p>
<p>Our <strong>Panj Pyare art print</strong> is popular with families — it is colorful, dynamic, and tells the inspiring story of the Five Beloved Ones in a way that captures children''s imagination.</p>

<h3>Home Office</h3>
<p>Your workspace should inspire focus and integrity. A piece of Sikh art that reminds you of the value of Kirat Karni (honest work) can set the right tone. Gurbani quotes about hard work, perseverance, and faith make excellent choices for a home office.</p>

<h2>Styling Tips for Sikh Art</h2>

<h3>Framing</h3>
<p>The right frame can elevate any piece. For traditional Sikh art, consider warm wood frames in walnut or oak tones. For modern pieces, sleek black or gold metal frames work beautifully. Canvas wraps need no frame at all — they create a clean, contemporary look.</p>

<h3>Color Coordination</h3>
<p>Sikh art often features rich colors: deep blues, warm golds, saffron, and earth tones. These colors pair beautifully with:</p>
<ul>
<li>Neutral walls in cream, white, or warm gray</li>
<li>Accent pillows and throws in complementary tones</li>
<li>Natural wood furniture</li>
<li>Brass or gold decorative elements (candle holders, vases)</li>
</ul>

<h3>Mixing Art with Cultural Elements</h3>
<p>Don''t be afraid to mix Sikh art with other cultural and decorative elements. A piece of Sikh artwork paired with fresh marigolds, a brass diya (lamp), or a handwoven Phulkari textile creates a beautiful vignette that celebrates Punjabi and Sikh culture.</p>

<h2>Gifting Sikh Art</h2>
<p>Sikh art makes a deeply meaningful gift for occasions like:</p>
<ul>
<li><strong>Housewarming</strong> — A Golden Temple print is a classic and treasured gift for a new home.</li>
<li><strong>Weddings</strong> — Gurbani calligraphy or a beautiful Guru portrait is a meaningful wedding gift.</li>
<li><strong>Vaisakhi</strong> — Celebrate the Sikh New Year with art that captures its joy and significance.</li>
<li><strong>Gurpurab</strong> — Honor the Guru''s birthday with a portrait or historical scene.</li>
<li><strong>Birthdays</strong> — For the Sikh art lover in your life, a new piece for their collection is always appreciated.</li>
</ul>

<h2>Explore the SikhiThreads Collection</h2>
<p>At SikhiThreads, every piece we create is designed to be more than decoration — it is a connection to your faith, your heritage, and your community. From canvas wraps and art prints to phone cases and mugs, our collection brings the beauty of Sikhi into every corner of your life.</p>
<p>Browse our full collection at <a href="/shop">our shop</a> and find the perfect piece to make your house feel like a Sikh home.</p>',
  NULL,
  'SikhiThreads',
  'guides',
  ARRAY['sikh-art', 'home-decor', 'interior-design', 'sikh-wall-art'],
  true,
  now(),
  'Sikh Art for Your Home — A Complete Decorating Guide | SikhiThreads',
  'Transform your living space with meaningful Sikh art. A room-by-room guide to choosing, placing, and styling Sikh artwork in your home.',
  'sikh art, sikh home decor, sikh wall art, how to display sikh art'
);


-- ============================================================
-- SEED DATA: Glossary Terms
-- ============================================================

INSERT INTO glossary_terms (term, slug, definition, pronunciation, category, related_terms, is_published) VALUES

('Waheguru', 'waheguru', 'The most commonly used name for God in Sikhi, meaning "Wonderful Lord" or "Wonderful Teacher." It is the central word of Sikh meditation and devotion, used in daily prayer and Naam Simran (remembrance of God). Waheguru represents the formless, timeless, and all-pervading Creator.', 'wah-HEY-goo-roo', 'beliefs', ARRAY['Naam Simran', 'Mool Mantar', 'Ik Onkar'], true),

('Gurdwara', 'gurdwara', 'A Sikh place of worship, meaning "Door to the Guru" or "Gateway to the Guru." Gurdwaras are open to all people regardless of faith, caste, or background. Every Gurdwara houses the Guru Granth Sahib, serves Langar (free meals), and is identified by the Nishan Sahib (Sikh flag) flying outside.', 'gur-DWAH-rah', 'places', ARRAY['Langar', 'Sangat', 'Nishan Sahib', 'Guru Granth Sahib'], true),

('Langar', 'langar', 'The community kitchen found in every Gurdwara, serving free vegetarian meals to all visitors without discrimination. Langar was established by Guru Nanak Dev Ji and embodies the Sikh values of equality, humility, and selfless service (Seva). Everyone sits together on the floor (Pangat) and eats the same food.', 'LUNG-ur', 'practices', ARRAY['Seva', 'Pangat', 'Gurdwara', 'Sangat'], true),

('Seva', 'seva', 'Selfless service performed without expectation of reward or recognition. Seva is a core Sikh practice and can take many forms — from serving in the Langar kitchen to community volunteering. It is considered one of the most important ways to practice humility and devotion.', 'SAY-vah', 'practices', ARRAY['Langar', 'Gurdwara', 'Sangat'], true),

('Khalsa', 'khalsa', 'The collective body of initiated (Amritdhari) Sikhs, established by Guru Gobind Singh Ji on Vaisakhi 1699. The word means "pure" or "sovereign." Members of the Khalsa are committed to upholding the highest ideals of Sikhi, wearing the Five Ks, and living a life of devotion, courage, and service.', 'KHAL-sah', 'beliefs', ARRAY['Amrit', 'Panj Pyare', 'Vaisakhi', 'Singh', 'Kaur'], true),

('Amrit', 'amrit', 'Sacred nectar prepared during the Amrit Sanchar (initiation) ceremony. Amrit is made by stirring water and sugar puffs (Patasay) in an iron bowl with a Khanda (double-edged sword) while reciting five Banis. Taking Amrit is the formal initiation into the Khalsa. The word Amrit means "immortal nectar."', 'UM-rit', 'practices', ARRAY['Khalsa', 'Panj Pyare', 'Vaisakhi'], true),

('Kirtan', 'kirtan', 'The devotional singing of Gurbani (Sikh scripture) set to musical ragas. Kirtan is a central part of Sikh worship and is performed in Gurdwaras around the world. Listening to and singing Kirtan is considered a powerful form of meditation and connection with the divine.', 'KEER-tun', 'practices', ARRAY['Gurbani', 'Gurdwara', 'Sangat'], true),

('Ardas', 'ardas', 'The formal Sikh prayer recited at the conclusion of most Sikh ceremonies and services. Ardas is a standing prayer that recalls Sikh history, seeks God''s blessings, and asks for the welfare of all humanity. It begins with remembrance of the Gurus and ends with the phrase "Nanak Naam Chardikala, Tere Bhane Sarbat Da Bhala" — in God''s will, may there be prosperity and blessings for all.', 'ur-DAAS', 'practices', ARRAY['Gurdwara', 'Guru Granth Sahib'], true),

('Guru Granth Sahib', 'guru-granth-sahib', 'The eternal, living Guru of the Sikhs — the holy scripture that serves as the supreme spiritual authority in Sikhi. Compiled by Guru Arjan Dev Ji and finalized by Guru Gobind Singh Ji, it contains 1,430 pages of hymns composed by six Sikh Gurus and various Hindu and Muslim saints. It is treated with the utmost reverence and is central to all Sikh ceremonies.', 'goo-roo GRUNTH SAH-hib', 'scripture', ARRAY['Gurbani', 'Hukamnama', 'Gurdwara'], true),

('Hukamnama', 'hukamnama', 'A random reading from the Guru Granth Sahib that serves as the Guru''s command or order for the day. Each morning, the Guru Granth Sahib is ceremonially opened and a Hukamnama is read — this is considered the Guru''s guidance for that day. Sikhs around the world read the daily Hukamnama from Sri Harmandir Sahib (Golden Temple).', 'hoo-KUM-nah-mah', 'scripture', ARRAY['Guru Granth Sahib', 'Gurdwara'], true),

('Mool Mantar', 'mool-mantar', 'The opening verse of the Guru Granth Sahib, composed by Guru Nanak Dev Ji. It is the foundational statement of Sikh theology, describing the nature of God: Ik Onkar (One Creator), Sat Naam (True Name), Karta Purakh (Creative Being), Nirbhau (Without Fear), Nirvair (Without Hatred), Akaal Moorat (Timeless Form), Ajuni (Beyond Birth and Death), Saibhang (Self-Existent), Gur Prasad (Known by the Guru''s Grace).', 'MOOL MUN-tur', 'scripture', ARRAY['Guru Granth Sahib', 'Waheguru', 'Gurbani'], true),

('Sangat', 'sangat', 'The congregation or community of Sikhs who gather together for worship, learning, and fellowship. Being in Sangat — the company of the holy — is considered essential for spiritual growth in Sikhi. The Gurus emphasized that spiritual progress is strengthened in community.', 'SUN-gut', 'practices', ARRAY['Gurdwara', 'Pangat', 'Kirtan'], true),

('Pangat', 'pangat', 'The practice of sitting together in rows on the floor to eat Langar. Pangat embodies the Sikh principle of equality — everyone, regardless of status, sits at the same level and eats the same food. The third Guru, Guru Amar Das Ji, established the principle "Pehle Pangat, Phir Sangat" — first eat together, then worship together.', 'PUN-gut', 'practices', ARRAY['Langar', 'Sangat', 'Gurdwara'], true),

('Nishan Sahib', 'nishan-sahib', 'The triangular Sikh flag that flies outside every Gurdwara. It is saffron (kesari) in color and bears the Khanda symbol. The Nishan Sahib is a visible marker that identifies a Gurdwara and signals to all that food, shelter, and spiritual guidance are available to anyone who needs them.', 'ni-SHAAN SAH-hib', 'symbols', ARRAY['Gurdwara', 'Khalsa'], true),

('Kaur', 'kaur', 'The surname given to all Sikh women, meaning "princess" or "sovereign." Guru Gobind Singh Ji gave this name to all Sikh women when he created the Khalsa in 1699, establishing their identity as royalty and equal to men in every way. Kaur replaced caste-based surnames and affirmed the dignity and independence of women.', 'KOR', 'beliefs', ARRAY['Singh', 'Khalsa', 'Vaisakhi'], true),

('Singh', 'singh', 'The surname given to all Sikh men, meaning "lion." Guru Gobind Singh Ji gave this name to all Sikh men when he created the Khalsa in 1699, replacing caste-based surnames with a single name that signified courage, strength, and equality. Every Sikh man carries the name Singh as a reminder of his commitment to the Khalsa ideals.', 'SING', 'beliefs', ARRAY['Kaur', 'Khalsa', 'Vaisakhi'], true),

('Vaisakhi', 'vaisakhi', 'One of the most important dates in the Sikh calendar, celebrated on April 13 or 14 each year. Vaisakhi commemorates the founding of the Khalsa by Guru Gobind Singh Ji in 1699. It is celebrated with Nagar Kirtans (street processions), special Gurdwara programs, Langar, and community gatherings worldwide.', 'vai-SAH-khee', 'festivals', ARRAY['Khalsa', 'Panj Pyare', 'Amrit', 'Nagar Kirtan'], true),

('Gurpurab', 'gurpurab', 'A celebration marking the birth or martyrdom anniversary of a Sikh Guru. Major Gurpurabs include the birth anniversaries of Guru Nanak Dev Ji and Guru Gobind Singh Ji, and the martyrdom anniversaries of Guru Arjan Dev Ji and Guru Tegh Bahadur Ji. Gurpurabs are marked with Akhand Path (continuous reading of scripture), Kirtan, processions, and Langar.', 'gur-PUR-ub', 'festivals', ARRAY['Gurdwara', 'Kirtan', 'Langar'], true),

('Amrit Vela', 'amrit-vela', 'The "ambrosial hours" — the early morning period before dawn (approximately 3 AM to 6 AM) considered the most spiritually potent time for meditation and prayer. Sikhs are encouraged to rise during Amrit Vela to bathe, meditate on Naam (God''s name), and recite their daily prayers (Nitnem). It is the quietest time of day, ideal for deep spiritual connection.', 'UM-rit VAY-lah', 'practices', ARRAY['Naam Simran', 'Waheguru', 'Gurbani'], true),

('Naam Simran', 'naam-simran', 'The practice of meditating on or remembering God''s name (Naam). It is one of the three pillars of Sikhi as taught by Guru Nanak Dev Ji. Naam Simran can be practiced through silent meditation, chanting Waheguru, listening to Kirtan, or simply maintaining an awareness of God''s presence throughout daily life.', 'NAAM SIM-run', 'practices', ARRAY['Waheguru', 'Amrit Vela', 'Kirtan'], true),

('Gurbani', 'gurbani', 'The sacred writings and hymns contained in the Guru Granth Sahib. The word literally means "the Guru''s word" or "the Guru''s utterance." Gurbani includes compositions by the Sikh Gurus as well as Hindu and Muslim saints whose writings aligned with the Sikh message of oneness and devotion.', 'gur-BAH-nee', 'scripture', ARRAY['Guru Granth Sahib', 'Kirtan', 'Mool Mantar'], true),

('Gatka', 'gatka', 'A traditional Sikh martial art that originated in the Punjab region. Gatka involves the use of weapons including swords, sticks, and shields, and is practiced as both a martial discipline and a performance art. It is commonly demonstrated during Nagar Kirtans and Sikh festivals, showcasing the warrior tradition of the Khalsa.', 'GUT-kah', 'practices', ARRAY['Khalsa', 'Vaisakhi', 'Kirpan'], true),

('Chaur Sahib', 'chaur-sahib', 'A ceremonial whisk made of yak hair or synthetic fibers, waved over the Guru Granth Sahib as a sign of sovereignty and respect. Just as a whisk was waved over kings and royalty in South Asian tradition, the Chaur Sahib honors the Guru Granth Sahib as the eternal sovereign of the Sikhs.', 'CHOR SAH-hib', 'symbols', ARRAY['Guru Granth Sahib', 'Gurdwara'], true),

('Kara', 'kara', 'A steel bracelet worn on the wrist — one of the Five Ks (Panj Kakaar) of the Khalsa. The Kara symbolizes an unbreakable bond with God and a commitment to righteousness. Its circular shape represents the eternity and infinity of God, and the steel represents strength.', 'KAH-rah', 'symbols', ARRAY['Khalsa', 'Kirpan', 'Kachera', 'Kanga', 'Kesh'], true),

('Kirpan', 'kirpan', 'A ceremonial sword or dagger — one of the Five Ks (Panj Kakaar) of the Khalsa. The Kirpan symbolizes a Sikh''s duty to stand up against injustice and protect the weak. It represents mercy (Kirpa) and grace, not aggression. Wearing the Kirpan is a reminder of the Sikh commitment to courage and defending the rights of all people.', 'kir-PAAN', 'symbols', ARRAY['Khalsa', 'Kara', 'Kachera', 'Kanga', 'Kesh'], true),

('Kachera', 'kachera', 'Cotton undergarments — one of the Five Ks (Panj Kakaar) of the Khalsa. Kachera represents modesty, self-discipline, and moral restraint. It is a practical article that also symbolizes readiness, as it was designed for warriors who needed to be prepared for action at all times.', 'kuh-CHAY-rah', 'symbols', ARRAY['Khalsa', 'Kara', 'Kirpan', 'Kanga', 'Kesh'], true),

('Kanga', 'kanga', 'A small wooden comb — one of the Five Ks (Panj Kakaar) of the Khalsa. The Kanga is worn in the hair and symbolizes cleanliness, order, and discipline. It represents the importance of caring for the body as a gift from God and maintaining physical and spiritual hygiene.', 'KUNG-ah', 'symbols', ARRAY['Khalsa', 'Kara', 'Kirpan', 'Kachera', 'Kesh'], true),

('Kesh', 'kesh', 'Uncut hair — one of the Five Ks (Panj Kakaar) of the Khalsa and the most visible article of Sikh faith. Keeping Kesh represents living in harmony with God''s will and accepting the natural form in which God created us. Sikhs cover their Kesh with a Dastar (turban) as a crown of their faith.', 'KAYSH', 'symbols', ARRAY['Khalsa', 'Dastar', 'Kara', 'Kirpan', 'Kachera', 'Kanga'], true),

('Dastar', 'dastar', 'The Sikh turban — a cloth article of faith wrapped around the head to cover and protect the Kesh (uncut hair). The Dastar is a symbol of sovereignty, dignity, self-respect, and spiritual devotion. Both Sikh men and women may wear a Dastar. It is not merely a cultural accessory but a crown of faith that identifies a Sikh and represents their commitment to the Guru''s path.', 'DUS-tar', 'symbols', ARRAY['Kesh', 'Khalsa'], true),

('Panj Pyare', 'panj-pyare', 'The "Five Beloved Ones" — the five courageous Sikhs who volunteered their lives when Guru Gobind Singh Ji called for sacrifices on Vaisakhi 1699. They were the first to be initiated into the Khalsa through the Amrit ceremony. The Panj Pyare continue to serve a ceremonial role in Sikh tradition, leading processions and administering Amrit.', 'punj pee-AH-ray', 'people', ARRAY['Khalsa', 'Vaisakhi', 'Amrit'], true),

('Sikh', 'sikh', 'A follower of Sikhi — the path revealed by Guru Nanak Dev Ji and the nine Gurus who followed. The word "Sikh" means "learner" or "disciple." A Sikh believes in one formless God (Waheguru), follows the teachings of the Guru Granth Sahib, and strives to live a life of honest work, meditation, and service to others.', 'SIKH (with a soft "kh")', 'general', ARRAY['Waheguru', 'Guru Granth Sahib', 'Khalsa'], true);

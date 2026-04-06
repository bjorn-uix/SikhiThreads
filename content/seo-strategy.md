# SikhiThreads — SEO Strategy & Optimization Plan
## Based on Semrush Keyword Research (April 2026)

---

## KEY FINDING: You're sitting on a SEO goldmine

Almost every Sikh art keyword has **0 keyword difficulty** — meaning there's virtually NO competition. You can rank on page 1 of Google for dozens of valuable keywords with minimal effort. This is extremely rare.

---

## Keyword Research Summary

### Tier 1: Primary Product Keywords (ZERO competition — rank immediately)

| Keyword | Monthly Search (US) | Monthly Search (IN) | KD | Priority |
|---------|--------------------|--------------------|-----|----------|
| **sikh art** | 170 | 480 | 13 | #1 — Homepage |
| **guru nanak dev ji painting** | 210 | 1,000 | 0 | #2 — Product + Blog |
| **golden temple art** | 20 | — | 0 | Product page |
| **sikh wall art** | low | — | 0 | Category page |
| **sikh home decor** | low | — | 0 | Category page |
| **sikh gifts** | low | — | 0 | Gift guide blog |
| **vaisakhi gifts** | low | — | 0 | Seasonal landing page |
| **khalsa art** | low | — | 0 | Product page |
| **waheguru wall art** | low | — | 0 | Product page |
| **sikh prints** | low | — | 0 | Category page |
| **sikh canvas** | low | — | 0 | Category page |
| **sikh baby gifts** | low | — | 0 | Blog + product |
| **sikh wedding gifts** | low | — | 0 | Blog + product |
| **sikh nursery decor** | low | — | 0 | Blog + product |
| **crochet art** | — | — | 27 | Brand differentiator |

### Tier 2: High-Volume Informational Keywords (Blog Content Targets)

| Keyword | Monthly Search (US) | KD | Content Type |
|---------|--------------------|----|--------------|
| **golden temple** | 12,100 | 27 | Blog: "Golden Temple — History Told Through Crochet Art" |
| **sikh religion** | 18,100 | 76 | Too competitive — skip for now |
| **guru nanak** | 9,900 | 45 | Blog: "The Life of Guru Nanak Dev Ji" |
| **waheguru** | 6,600 | 31 | Blog: "What Does Waheguru Mean?" |
| **vaisakhi** | 3,600 | 56 | Blog: "What is Vaisakhi?" (seasonal spike in April) |
| **khalsa** | 1,600 | 45 | Blog: "The Story of the Khalsa" |
| **langar** | 1,600 | 28 | Blog: "Langar: The World's Largest Free Kitchen" |
| **happy vaisakhi** | 390 | 23 | Seasonal landing page |
| **what is vaisakhi** | 320 | 38 | Blog: FAQ-style article |
| **sikh festival** | 140 | 28 | Blog: "Sikh Festivals Calendar" |
| **sikh wedding** | varies | 25 | Blog: "Sikh Wedding Traditions" + gift products |
| **sikh turban** | varies | 19 | Blog: "The Sikh Turban — Its Meaning and Significance" |
| **sikh culture** | 50 | 24 | Blog: "Understanding Sikh Culture" |

### Tier 3: Question Keywords (Featured Snippet Opportunities)

| Question | Monthly Searches | Content |
|----------|-----------------|---------|
| what is vaisakhi | 320 | Blog post |
| when is vaisakhi | 210 | Blog post + seasonal page |
| why is vaisakhi celebrated | 70 | Blog post |
| how is vaisakhi celebrated | 50 | Blog post |
| who celebrates vaisakhi | 40 | Blog post |
| what is vaisakhi and why is it celebrated | 30 | Blog post |

---

## TECHNICAL SEO FIXES (Do These First)

### 1. Add Meta Tags to Every Page

**Current state:** Only the homepage has a basic meta description. Product pages, shop page, and collection pages have NO individual meta tags.

**Fix:** Update the React app to set dynamic `<title>` and `<meta name="description">` for every page.

**Implementation:**
```
Homepage: "SikhiThreads — Sikh Art & Crochet Storytelling | Wall Art, Prints & Gifts"
Shop: "Shop Sikh Art — Wall Art, Canvas, Phone Cases & More | SikhiThreads"
Product: "[Product Name] | SikhiThreads — Sikh Crochet Art"
Collection: "[Collection Name] — Sikh Art Collection | SikhiThreads"
Our Story: "Our Story — SikhiThreads | Sikh Stories Woven in Thread"
Blog posts: "[Post Title] | SikhiThreads Blog"
```

### 2. Add Open Graph & Twitter Card Meta Tags

Every page needs:
```html
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />
<meta property="og:url" content="..." />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
```

### 3. Add Structured Data (JSON-LD Schema)

**Product pages** need Product schema:
```json
{
  "@type": "Product",
  "name": "...",
  "image": "...",
  "description": "...",
  "offers": {
    "@type": "Offer",
    "price": "35.00",
    "priceCurrency": "USD",
    "availability": "InStock"
  }
}
```

**Homepage** needs Organization schema.
**Blog posts** need Article schema.
**FAQ pages** need FAQPage schema.

### 4. Create a Sitemap.xml

Generate a sitemap at sikhithreads.com/sitemap.xml that lists:
- All product pages
- All collection pages
- All blog posts
- Static pages (home, shop, about, contact)

### 5. Add robots.txt

```
User-agent: *
Allow: /
Sitemap: https://sikhithreads.com/sitemap.xml
Disallow: /admin
Disallow: /checkout
Disallow: /cart
```

### 6. Submit to Google Search Console

1. Go to search.google.com/search-console
2. Add property: sikhithreads.com
3. Verify via DNS TXT record
4. Submit sitemap.xml
5. Request indexing of homepage

### 7. Page Speed Optimization

- Add lazy loading to product images
- Compress images (use WebP format)
- Code-split the React app (separate admin bundle)
- Add `loading="lazy"` to below-fold images

---

## ON-PAGE SEO PLAN

### Homepage Optimization
**Target keyword:** "sikh art" + "sikh crochet art"

- **Title tag:** "SikhiThreads — Sikh Art & Crochet Storytelling | Handcrafted Wall Art & Gifts"
- **H1:** "Sikh Stories Woven in Thread" (already good)
- **Add H2s with keywords:**
  - "Explore Our Sikh Art Collection"
  - "Handcrafted Crochet Art Celebrating Sikhi"
  - "Vaisakhi Collection — Limited Edition Sikh Art"
- **Alt text on all images** with descriptive, keyword-rich text
- **Internal links** to top product pages and blog posts

### Product Page Optimization
Each product page should have:
- **Title:** "[Product Name] — Sikh Crochet Art Print | SikhiThreads"
- **H1:** Product name
- **200+ word description** with natural keyword usage
- **Alt text on every image**: "Crochet-style [scene] Sikh art print by SikhiThreads"
- **Schema markup** (Product + Offer)
- **Related products** section (internal links)
- **Customer reviews** (once you get them — reviews boost SEO significantly)

### Category/Collection Pages
- /collections/vaisakhi → "Vaisakhi Collection — Sikh Art Celebrating Khalsa Sajna Diwas"
- /collections/wall-art → "Sikh Wall Art — Art Prints & Canvas | SikhiThreads"
- /collections/digital-downloads → "Digital Sikh Art Downloads — Wallpapers & Prints"

---

## CONTENT/BLOG SEO PLAN (Long-Term Traffic Engine)

### Priority 1: Publish These 5 Blog Posts First (within 2 weeks)

1. **"What is Vaisakhi? The Complete Guide to the Sikh New Year"**
   - Target: "what is vaisakhi" (320/mo), "vaisakhi" (3,600/mo spike in April)
   - 1,500+ words, include history, traditions, how it's celebrated, significance
   - Include your Vaisakhi art throughout the post
   - Link to Vaisakhi collection products
   - **URGENT — Vaisakhi is April 13, publish ASAP for seasonal traffic**

2. **"The Story of the Golden Temple — Harmandir Sahib Through Art"**
   - Target: "golden temple" (12,100/mo), "golden temple art" (20/mo)
   - History, significance, architecture, your Golden Temple artwork
   - Link to Golden Temple products

3. **"Guru Nanak Dev Ji — The Founder of Sikhi"**
   - Target: "guru nanak" (9,900/mo), "guru nanak dev ji painting" (210 US + 1,000 IN)
   - Life story, teachings, legacy
   - Link to Guru Nanak products

4. **"What is Langar? The World's Largest Free Kitchen"**
   - Target: "langar" (1,600/mo)
   - History, how it works, significance of equality in Sikhi
   - Link to Langar art print

5. **"Sikh Art for Your Home — A Complete Decorating Guide"**
   - Target: "sikh art" (170/mo), "sikh home decor", "sikh wall art"
   - Room-by-room guide with product recommendations
   - Heavy product linking

### Priority 2: Publish Monthly (Ongoing)

6. "The Story of the Khalsa — How Guru Gobind Singh Ji Changed History"
7. "Sikh Wedding Traditions — A Beautiful Guide + Gift Ideas"
8. "What Does Waheguru Mean? Understanding the Sikh Divine"
9. "The Sikh Turban — Meaning, History, and Pride"
10. "Sikh Festivals Calendar 2026 — Important Dates and Celebrations"
11. "5 Sikh Values That Can Transform Your Life"
12. "Mai Bhago — The Warrior Woman of Sikhi"
13. "Crochet Art — How We Bring Sikh Stories to Life Through Thread"
14. "The Best Sikh Gifts for Every Occasion"
15. "Sikh Baby Names — Meaning and Significance"

### Blog Post Template for SEO:
- **Minimum 1,200 words** (Google favors comprehensive content)
- **H2/H3 subheadings** every 200-300 words
- **Include at least 3 internal links** to products
- **Include at least 1 external link** to a reputable source
- **Add 3-5 images** with keyword-rich alt text
- **End with a CTA** linking to relevant products
- **FAQ section** at the bottom (captures featured snippets)

---

## LINK BUILDING STRATEGY

### Phase 1: Easy Wins (Week 1-4)
1. **Submit to Sikh directories:**
   - SikhNet.com
   - Sikh24.com
   - SikhiWiki.org
   - Basics of Sikhi (YouTube/website)

2. **Social profiles (create and link back):**
   - Instagram (done)
   - TikTok
   - Pinterest (critical for art/visual brands)
   - YouTube
   - Twitter/X
   - Facebook page

3. **Pinterest SEO** (huge for art brands):
   - Create a business account
   - Pin every product with keyword-rich descriptions
   - Create boards: "Sikh Art", "Vaisakhi Decor", "Golden Temple Art", "Sikh Home Decor"
   - Pinterest acts as a search engine — your visual content will thrive here

### Phase 2: PR & Outreach (Month 2-3)
4. **Reach out to Sikh media:**
   - SikhNet, Sikh24, Basics of Sikhi, Sikh Press Association
   - Pitch: "Young creator brings Sikh stories to life through crochet art"
   - Each backlink from these sites = massive SEO boost

5. **Guest posts:**
   - Write for Sikh blogs about Vaisakhi, Sikh art history, etc.
   - Include link back to sikhithreads.com

6. **HARO / Qwoted / Featured:**
   - Sign up for journalist query services
   - Respond to queries about Sikh culture, art, holiday gifts

### Phase 3: Community (Ongoing)
7. **Reddit** — Post in r/Sikh, r/crochet, r/art (follow community rules)
8. **Quora** — Answer questions about Sikh art, Vaisakhi gifts, Sikh home decor
9. **Partner with Gurdwaras** — link exchanges with Gurdwara websites

---

## LOCAL SEO (If applicable)
- Create a Google Business Profile if you have a physical location
- Even without one, register as an online retailer

---

## TRACKING & MEASUREMENT

### Set Up:
1. **Google Search Console** — Track impressions, clicks, keyword rankings
2. **Google Analytics 4** — Track traffic, conversions, user behavior
3. **Meta Pixel** — Track Instagram ad conversions
4. **Semrush Position Tracking** — Monitor keyword rankings weekly

### Monthly KPIs:
| Metric | Month 1 | Month 3 | Month 6 |
|--------|---------|---------|---------|
| Organic traffic | 100 | 1,000 | 5,000 |
| Keywords ranking top 10 | 5 | 20 | 50 |
| Keywords ranking top 100 | 20 | 100 | 300 |
| Backlinks | 10 | 30 | 100 |
| Blog posts published | 5 | 12 | 24 |

---

## IMMEDIATE ACTION ITEMS (This Week)

1. [ ] **Add meta title/description to every page** (React Helmet or manual)
2. [ ] **Create sitemap.xml and robots.txt**
3. [ ] **Submit to Google Search Console**
4. [ ] **Publish "What is Vaisakhi" blog post** (urgent — Vaisakhi is April 13)
5. [ ] **Add alt text to all product images**
6. [ ] **Set up Pinterest business account and pin all products**
7. [ ] **Add structured data (JSON-LD) to product pages**
8. [ ] **Add Open Graph meta tags for social sharing**
9. [ ] **Create and submit Google Business Profile**
10. [ ] **Install Google Analytics 4 + Meta Pixel**

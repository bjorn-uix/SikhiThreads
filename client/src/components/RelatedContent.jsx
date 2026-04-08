import { Link } from 'react-router-dom'
import { BookOpen, ShoppingBag, ArrowRight } from 'lucide-react'

const TOPIC_CLUSTERS = {
  'vaisakhi': {
    blogs: [
      { slug: 'what-is-vaisakhi', title: 'What is Vaisakhi and How It Is Celebrated' },
    ],
    products: [
      { slug: 'vaisakhi-celebration-canvas-wrap', name: 'Vaisakhi Celebration Canvas Wrap' },
      { slug: 'panj-pyare-art-print', name: 'Panj Pyare Art Print' },
      { slug: 'vaisakhi-greeting-card-pack', name: 'Vaisakhi Greeting Card Pack' },
    ],
    glossary: [
      { slug: 'vaisakhi', term: 'Vaisakhi' },
      { slug: 'khalsa', term: 'Khalsa' },
      { slug: 'panj-pyare', term: 'Panj Pyare' },
    ],
    landing: ['/l/vaisakhi-decorations'],
  },
  'golden-temple': {
    blogs: [
      { slug: 'golden-temple-harmandir-sahib', title: 'The Golden Temple (Harmandir Sahib)' },
    ],
    products: [
      { slug: 'golden-temple-at-dawn-canvas-wrap', name: 'Golden Temple at Dawn Canvas Wrap' },
      { slug: 'golden-temple-phone-case', name: 'Golden Temple Phone Case' },
      { slug: 'golden-temple-digital-download', name: 'Golden Temple Digital Download' },
    ],
    glossary: [
      { slug: 'gurdwara', term: 'Gurdwara' },
      { slug: 'harmandir-sahib', term: 'Harmandir Sahib' },
    ],
    landing: ['/l/golden-temple-wallpaper', '/l/golden-temple-painting'],
  },
  'guru-nanak': {
    blogs: [
      { slug: 'guru-nanak-dev-ji', title: 'Guru Nanak Dev Ji — Life and Teachings' },
    ],
    products: [
      { slug: 'guru-nanak-dev-ji-art-print', name: 'Guru Nanak Dev Ji Art Print' },
    ],
    glossary: [
      { slug: 'guru-granth-sahib', term: 'Guru Granth Sahib' },
      { slug: 'mool-mantar', term: 'Mool Mantar' },
      { slug: 'gurbani', term: 'Gurbani' },
    ],
    landing: ['/l/guru-nanak-wallpaper'],
  },
  'langar': {
    blogs: [
      { slug: 'what-is-langar', title: 'What is Langar and Its Message of Equality' },
    ],
    products: [
      { slug: 'langar-everyone-is-equal-art-print', name: 'Langar: Everyone is Equal Art Print' },
      { slug: 'langar-scene-ceramic-mug', name: 'Langar Scene Ceramic Mug' },
    ],
    glossary: [
      { slug: 'langar', term: 'Langar' },
      { slug: 'seva', term: 'Seva' },
      { slug: 'pangat', term: 'Pangat' },
      { slug: 'sangat', term: 'Sangat' },
    ],
    landing: [],
  },
  'home-decor': {
    blogs: [
      { slug: 'sikh-art-home-decorating-guide', title: 'Sikh Art Home Decorating Guide' },
    ],
    products: [
      { slug: 'golden-temple-at-dawn-canvas-wrap', name: 'Golden Temple at Dawn Canvas Wrap' },
      { slug: 'sikhithreads-cotton-tote-bag', name: 'SikhiThreads Cotton Tote Bag' },
    ],
    glossary: [],
    landing: ['/l/sikh-home-decor'],
  },
  'khalsa': {
    blogs: [
      { slug: 'what-is-vaisakhi', title: 'What is Vaisakhi and How It Is Celebrated' },
    ],
    products: [
      { slug: 'khalsa-pride-phone-case', name: 'Khalsa Pride Phone Case' },
      { slug: 'khalsa-pride-hoodie', name: 'Khalsa Pride Hoodie' },
      { slug: 'panj-pyare-art-print', name: 'Panj Pyare Art Print' },
    ],
    glossary: [
      { slug: 'khalsa', term: 'Khalsa' },
      { slug: 'amrit', term: 'Amrit' },
      { slug: 'panj-pyare', term: 'Panj Pyare' },
    ],
    landing: [],
  },
  'seva': {
    blogs: [
      { slug: 'what-is-langar', title: 'What is Langar and Its Message of Equality' },
    ],
    products: [
      { slug: 'seva-community-service-art-print', name: 'Seva: Community Service Art Print' },
      { slug: 'langar-everyone-is-equal-art-print', name: 'Langar: Everyone is Equal Art Print' },
    ],
    glossary: [
      { slug: 'seva', term: 'Seva' },
      { slug: 'langar', term: 'Langar' },
    ],
    landing: [],
  },
}

// Map slugs to topic clusters
const BLOG_TOPIC_MAP = {
  'what-is-vaisakhi': ['vaisakhi'],
  'golden-temple-harmandir-sahib': ['golden-temple'],
  'guru-nanak-dev-ji': ['guru-nanak'],
  'what-is-langar': ['langar', 'seva'],
  'sikh-art-home-decorating-guide': ['home-decor', 'golden-temple'],
}

const PRODUCT_TOPIC_MAP = {
  'langar-everyone-is-equal-art-print': ['langar', 'seva'],
  'vaisakhi-celebration-canvas-wrap': ['vaisakhi'],
  'panj-pyare-art-print': ['vaisakhi', 'khalsa'],
  'nagar-kirtan-procession-art-print': ['vaisakhi'],
  'amrit-vela-morning-prayer-art-print': ['guru-nanak'],
  'golden-temple-at-dawn-canvas-wrap': ['golden-temple', 'home-decor'],
  'guru-nanak-dev-ji-art-print': ['guru-nanak'],
  'seva-community-service-art-print': ['seva', 'langar'],
  'khalsa-pride-phone-case': ['khalsa', 'vaisakhi'],
  'golden-temple-phone-case': ['golden-temple'],
  'langar-scene-ceramic-mug': ['langar'],
  'sikhithreads-cotton-tote-bag': ['home-decor'],
  'vaisakhi-greeting-card-pack': ['vaisakhi'],
  'vaisakhi-wallpaper-pack': ['vaisakhi'],
  'daily-inspiration-wallpaper-pack': ['guru-nanak'],
  'golden-temple-digital-download': ['golden-temple'],
  'sikhithreads-signature-tshirt': ['khalsa'],
  'khalsa-pride-hoodie': ['khalsa'],
}

function getRelatedContent(currentType, currentSlug, maxItems = 3) {
  const topicMap = currentType === 'blog' ? BLOG_TOPIC_MAP : PRODUCT_TOPIC_MAP
  const topics = topicMap[currentSlug] || []

  const blogs = []
  const products = []
  const glossary = []
  const seenBlogSlugs = new Set()
  const seenProductSlugs = new Set()
  const seenGlossarySlugs = new Set()

  for (const topic of topics) {
    const cluster = TOPIC_CLUSTERS[topic]
    if (!cluster) continue

    for (const b of cluster.blogs) {
      if (currentType === 'blog' && b.slug === currentSlug) continue
      if (!seenBlogSlugs.has(b.slug)) {
        seenBlogSlugs.add(b.slug)
        blogs.push(b)
      }
    }
    for (const p of cluster.products) {
      if (currentType === 'product' && p.slug === currentSlug) continue
      if (!seenProductSlugs.has(p.slug)) {
        seenProductSlugs.add(p.slug)
        products.push(p)
      }
    }
    for (const g of cluster.glossary) {
      if (!seenGlossarySlugs.has(g.slug)) {
        seenGlossarySlugs.add(g.slug)
        glossary.push(g)
      }
    }
  }

  return {
    blogs: blogs.slice(0, maxItems),
    products: products.slice(0, maxItems),
    glossary: glossary.slice(0, maxItems),
  }
}

export default function RelatedContent({ currentType, currentSlug }) {
  const { blogs, products, glossary } = getRelatedContent(currentType, currentSlug)

  const hasContent = blogs.length > 0 || products.length > 0 || glossary.length > 0
  if (!hasContent) return null

  return (
    <section className="border-t border-gold-light/30 mt-12 pt-12">
      <h2 className="font-heading text-2xl font-bold text-charcoal mb-8 text-center">
        Explore More
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Related Blog Posts */}
        {blogs.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={16} className="text-gold" />
              <h3 className="font-heading text-sm font-semibold text-warm-gray tracking-wider uppercase">
                From the Blog
              </h3>
            </div>
            <div className="space-y-3">
              {blogs.map(b => (
                <Link
                  key={b.slug}
                  to={`/blog/${b.slug}`}
                  className="block bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all no-underline group"
                >
                  <h4 className="font-heading text-sm font-bold text-charcoal group-hover:text-brown transition-colors line-clamp-2">
                    {b.title}
                  </h4>
                  <span className="text-xs text-gold mt-1 inline-flex items-center gap-1">
                    Read more <ArrowRight size={10} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {products.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag size={16} className="text-gold" />
              <h3 className="font-heading text-sm font-semibold text-warm-gray tracking-wider uppercase">
                Related Products
              </h3>
            </div>
            <div className="space-y-3">
              {products.map(p => (
                <Link
                  key={p.slug}
                  to={`/products/${p.slug}`}
                  className="block bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all no-underline group"
                >
                  <h4 className="font-heading text-sm font-bold text-charcoal group-hover:text-brown transition-colors line-clamp-2">
                    {p.name}
                  </h4>
                  <span className="text-xs text-gold mt-1 inline-flex items-center gap-1">
                    View product <ArrowRight size={10} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Glossary Terms */}
        {glossary.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={16} className="text-gold" />
              <h3 className="font-heading text-sm font-semibold text-warm-gray tracking-wider uppercase">
                Glossary Terms
              </h3>
            </div>
            <div className="space-y-3">
              {glossary.map(g => (
                <Link
                  key={g.slug}
                  to={`/glossary#${g.slug}`}
                  className="block bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all no-underline group"
                >
                  <h4 className="font-heading text-sm font-bold text-charcoal group-hover:text-brown transition-colors">
                    {g.term}
                  </h4>
                  <span className="text-xs text-gold mt-1 inline-flex items-center gap-1">
                    Learn more <ArrowRight size={10} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

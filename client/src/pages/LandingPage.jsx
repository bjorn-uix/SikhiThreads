import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowRight, ChevronDown, ChevronUp, Home } from 'lucide-react'
import SEO from '../components/SEO'
import ProductCard from '../components/ProductCard'
import { api } from '../lib/api'

// ---------------------------------------------------------------------------
// Landing page configurations
// ---------------------------------------------------------------------------
const LANDING_PAGES = {
  'golden-temple-wallpaper': {
    title: 'Golden Temple Wallpaper — HD & 4K Downloads for Phone & Desktop | SikhiThreads',
    h1: 'Golden Temple Wallpaper',
    description:
      'Download stunning Golden Temple wallpaper in HD and 4K for your phone and desktop. SikhiThreads offers unique crochet-style Golden Temple Amritsar wallpaper, art prints, and digital downloads.',
    keywords:
      'golden temple wallpaper, golden temple hd wallpaper, golden temple 4k wallpaper, golden temple amritsar wallpaper, golden temple phone wallpaper, harmandir sahib wallpaper, golden temple desktop wallpaper',
    breadcrumbCategory: 'Wallpapers',
    productFilter: (p) =>
      /golden.?temple/i.test(p.name) ||
      (p.collection_tags || []).some((t) => /evergreen/i.test(t)),
    searchQuery: 'golden temple',
    content: `The Golden Temple, also known as Harmandir Sahib or Darbar Sahib, is the spiritual heart of Sikhism and one of the most photographed buildings in the world. Its shimmering golden facade reflected in the sacred Amrit Sarovar pool has inspired millions of people across faiths and cultures. A Golden Temple wallpaper on your phone or desktop is more than decoration — it is a daily reminder of the values of equality, humility, and devotion that the Gurdwara embodies.

At SikhiThreads, we offer a completely unique take on Golden Temple imagery. Our crochet-aesthetic art style transforms the iconic Harmandir Sahib into warm, textured digital pieces that feel handcrafted and personal. Unlike generic stock photos, every SikhiThreads wallpaper carries an artistic signature that blends traditional Sikh heritage with modern design sensibilities. Whether you are looking for a Golden Temple HD wallpaper for your laptop, a 4K Golden Temple wallpaper for your widescreen monitor, or a perfectly sized Golden Temple phone wallpaper for your iPhone or Android, our digital download packs have you covered.

Our Golden Temple Amritsar wallpaper collection captures different moods — the golden glow of dawn over the Sarovar, the festive energy of Vaisakhi celebrations, and the peaceful calm of an evening Rehras Sahib. Each piece is rendered in rich, warm tones that complement any screen. Browse our collection below and bring the sacred beauty of the Golden Temple into your everyday life.`,
    faqs: [
      {
        q: 'Where can I download Golden Temple wallpaper?',
        a: 'You can download unique crochet-style Golden Temple wallpaper right here at SikhiThreads. Our digital download packs include multiple resolutions for phones, tablets, and desktops. Simply add a wallpaper pack to your cart, complete checkout, and receive instant download links.',
      },
      {
        q: 'What size Golden Temple wallpaper should I get?',
        a: 'For iPhones and most Android phones, a resolution of 1170x2532 or higher works best. For desktops and laptops, look for 1920x1080 (Full HD) or 3840x2160 (4K). Our wallpaper packs include multiple sizes so you can use them across all your devices.',
      },
      {
        q: 'Is the Golden Temple wallpaper free?',
        a: 'Our premium crochet-style Golden Temple wallpapers are available as affordable digital downloads starting at just a few dollars. The unique artistic style and multiple resolution options make them well worth the small investment. Check our shop for current pricing.',
      },
      {
        q: 'Can I use Golden Temple wallpaper on my iPhone?',
        a: 'Absolutely! Our Golden Temple wallpaper packs include sizes optimized for iPhones, including the latest iPhone Pro Max models. After downloading, simply go to Settings > Wallpaper > Add New Wallpaper and select the image from your Photos.',
      },
      {
        q: 'What makes SikhiThreads Golden Temple wallpaper different?',
        a: 'Unlike generic photos, our wallpapers feature a signature crochet-aesthetic art style that transforms the Golden Temple into warm, textured digital art. Each piece is original artwork created by our team, blending traditional Sikh heritage with a modern, handcrafted feel.',
      },
    ],
    relatedBlog: { slug: '/blog/golden-temple-harmandir-sahib', label: 'The Golden Temple: History of Harmandir Sahib' },
    relatedGlossary: { slug: '/glossary', label: 'Harmandir Sahib in the Sikh Glossary', anchor: 'Harmandir Sahib' },
    cta: 'Browse Golden Temple Art',
  },

  'waheguru-wallpaper': {
    title: 'Waheguru Wallpaper — Beautiful Sikh Art for Your Phone & Desktop | SikhiThreads',
    h1: 'Waheguru Wallpaper',
    description:
      'Download beautiful Waheguru wallpaper for your phone and desktop. Spiritual Sikh art featuring Waheguru calligraphy and crochet-style designs from SikhiThreads.',
    keywords:
      'waheguru wallpaper, waheguru hd wallpaper, waheguru phone wallpaper, sikh wallpaper, waheguru ji wallpaper, sikh spiritual wallpaper',
    breadcrumbCategory: 'Wallpapers',
    productFilter: (p) =>
      /waheguru/i.test(p.name) || /prayer|amrit.?vela/i.test(p.name),
    searchQuery: 'waheguru',
    content: `Waheguru is the most common name for God in Sikhism, an expression of awe and wonder at the divine creation. The word itself is a mantra — "Wah" meaning wonderful and "Guru" meaning the divine teacher who brings light to darkness. For millions of Sikhs worldwide, repeating "Waheguru" is a form of meditation that brings inner peace and connects the soul to the Infinite.

A Waheguru wallpaper on your phone or desktop serves as a gentle, constant reminder of this divine connection throughout your busy day. Every time you unlock your phone or open your laptop, the sacred word Waheguru greets you, centering your mind and spirit even in the middle of hectic schedules and endless notifications.

SikhiThreads offers Waheguru wallpapers unlike any you have seen before. Our crochet-aesthetic art style wraps the sacred calligraphy in warm textures and rich colors that feel handcrafted and intentional. From bold Gurmukhi script designs to contemplative scenes of Amrit Vela morning meditation, each wallpaper is a piece of devotional art designed to uplift your spirit. Our digital packs include sizes for every device — whether you need a Waheguru phone wallpaper for your iPhone, an HD version for your tablet, or a widescreen desktop background. Explore our collection below and carry the name of Waheguru with you wherever you go.`,
    faqs: [
      {
        q: 'What does Waheguru mean?',
        a: 'Waheguru is the primary name for God in Sikhism. It is composed of "Wah" (wonderful, awe-inspiring) and "Guru" (the divine teacher or enlightener). Repeating Waheguru is a core practice of Sikh meditation known as Naam Simran.',
      },
      {
        q: 'Where can I get Waheguru wallpaper?',
        a: 'SikhiThreads offers beautifully designed Waheguru wallpapers as digital downloads. Our unique crochet-style art transforms Waheguru calligraphy and spiritual scenes into stunning phone and desktop backgrounds.',
      },
      {
        q: 'Can I use Waheguru wallpaper on Android and iPhone?',
        a: 'Yes! Our Waheguru wallpaper packs come in multiple resolutions optimized for both Android and iPhone devices, as well as tablets and desktop monitors.',
      },
      {
        q: 'Is it respectful to use Waheguru as a wallpaper?',
        a: 'Many Sikhs use Waheguru wallpapers as a form of devotion and a reminder of God throughout the day. The sacred word serves as a gentle prompt for Naam Simran (meditation on God\'s name). It is a personal expression of faith that many find uplifting and meaningful.',
      },
    ],
    relatedGlossary: { slug: '/glossary', label: 'Waheguru in the Sikh Glossary', anchor: 'Waheguru' },
    cta: 'Shop Waheguru Art',
  },

  'guru-nanak-wallpaper': {
    title: 'Guru Nanak Dev Ji Wallpaper — Sikh Art Downloads | SikhiThreads',
    h1: 'Guru Nanak Dev Ji Wallpaper',
    description:
      'Download beautiful Guru Nanak Dev Ji wallpaper and paintings in HD. Unique crochet-style Sikh art prints and digital downloads from SikhiThreads.',
    keywords:
      'guru nanak wallpaper, guru nanak dev ji wallpaper, guru nanak dev ji painting, guru nanak art, guru nanak phone wallpaper, sikh guru wallpaper',
    breadcrumbCategory: 'Wallpapers',
    productFilter: (p) =>
      /guru.?nanak/i.test(p.name),
    searchQuery: 'guru nanak',
    content: `Guru Nanak Dev Ji, the founder of Sikhism, is one of the most beloved spiritual figures in world history. Born in 1469 in Talwandi (now Nankana Sahib, Pakistan), Guru Nanak Ji traveled across South Asia and the Middle East spreading a revolutionary message of equality, compassion, and devotion to one God. His teachings form the foundation of Sikh philosophy — that all human beings are equal regardless of caste, creed, gender, or religion.

A Guru Nanak Dev Ji wallpaper is more than beautiful art — it is a daily inspiration to live by the principles of Kirat Karni (honest work), Naam Japna (remembering God), and Vand Chakna (sharing with others). Whether displayed on your phone, tablet, or computer screen, the image of Guru Nanak Ji serves as a gentle reminder to walk the path of truth and compassion.

SikhiThreads brings Guru Nanak Dev Ji to life through our distinctive crochet-aesthetic art style. Our digital art captures the warmth and serenity of the first Guru with rich textures, golden tones, and meticulous detail that sets our work apart from generic stock imagery. From contemplative portraits to vibrant depictions of Guru Nanak Ji's travels, each piece is crafted with deep reverence and artistic care. Our wallpaper packs include optimized sizes for iPhones, Android devices, tablets, and desktop screens. Explore our Guru Nanak Dev Ji collection below and honor the first Guru every time you glance at your screen.`,
    faqs: [
      {
        q: 'Where can I download Guru Nanak Dev Ji wallpaper?',
        a: 'SikhiThreads offers unique crochet-style Guru Nanak Dev Ji wallpapers as digital downloads. Our packs include multiple resolutions for phones, tablets, and desktops. Visit our shop to browse and purchase.',
      },
      {
        q: 'What art styles are available for Guru Nanak wallpaper?',
        a: 'Our Guru Nanak Dev Ji art features a signature crochet-aesthetic style that blends warm textures with Sikh heritage. We offer both contemplative portrait-style pieces and vibrant scene depictions of Guru Nanak Ji\'s life and travels.',
      },
      {
        q: 'Can I get Guru Nanak Dev Ji paintings as prints?',
        a: 'Yes! In addition to digital wallpapers, SikhiThreads offers Guru Nanak Dev Ji art as physical prints, canvas wraps, and framed pieces. These make beautiful additions to any home or meaningful gifts for loved ones.',
      },
      {
        q: 'Who was Guru Nanak Dev Ji?',
        a: 'Guru Nanak Dev Ji (1469-1539) was the founder of Sikhism and the first of the ten Sikh Gurus. He taught the oneness of God, equality of all people, and the importance of honest living, meditation, and sharing with others.',
      },
    ],
    relatedBlog: { slug: '/blog/guru-nanak-dev-ji', label: 'Guru Nanak Dev Ji: Life & Legacy' },
    relatedGlossary: { slug: '/glossary', label: 'Guru Nanak in the Sikh Glossary', anchor: 'Guru Nanak' },
    cta: 'Shop Guru Nanak Art',
  },

  'golden-temple-painting': {
    title: 'Golden Temple Painting — Crochet-Style Sikh Art Prints & Canvas | SikhiThreads',
    h1: 'Golden Temple Painting',
    description:
      'Shop unique Golden Temple paintings in crochet-style art. Premium canvas wraps, framed prints, and wall art of Harmandir Sahib from SikhiThreads. Free shipping over $50.',
    keywords:
      'golden temple painting, golden temple art, golden temple canvas, harmandir sahib painting, golden temple wall art, sikh painting, golden temple print',
    breadcrumbCategory: 'Wall Art',
    productFilter: (p) =>
      /golden.?temple/i.test(p.name) && !/digital|wallpaper|phone/i.test(p.name),
    searchQuery: 'golden temple',
    content: `A Golden Temple painting has the power to transform any room into a space of serenity and devotion. The Harmandir Sahib, with its luminous golden dome and sacred waters, is one of the most visually stunning landmarks in the world — and one of the most deeply meaningful. For Sikh families, a Golden Temple painting in the home is a statement of faith, identity, and pride.

At SikhiThreads, we reimagine the Golden Temple through our signature crochet-aesthetic art style. Unlike traditional paintings or photographs, our pieces capture the warmth and texture of handcrafted crochet, translated into premium print media. The result is Golden Temple art that feels intimate and personal — as if each thread was woven with devotion. Our canvas wraps bring depth and dimension to the golden domes and reflective Sarovar, while our framed art prints deliver gallery-quality sharpness with a cozy, handmade feel.

Whether you are decorating a living room, prayer room, or office, a SikhiThreads Golden Temple painting makes a stunning focal point. Our pieces are available in multiple sizes — from compact prints perfect for a bedside table to large canvas wraps that command an entire wall. Each piece uses archival-quality materials designed to maintain vibrant color for years. They also make thoughtful gifts for housewarmings, weddings, and Gurpurabs. Explore our collection below and bring the sacred beauty of Harmandir Sahib into your home.`,
    faqs: [
      {
        q: 'What sizes are available for Golden Temple paintings?',
        a: 'SikhiThreads offers Golden Temple paintings in a range of sizes from compact 8x10 inch prints to large 24x36 inch canvas wraps. Check individual product listings for available size options.',
      },
      {
        q: 'What is the crochet-style art technique?',
        a: 'Our crochet-style art is a distinctive visual approach that gives digital and printed art the warm, textured appearance of handcrafted crochet. It is our signature style that makes SikhiThreads pieces instantly recognizable and uniquely personal.',
      },
      {
        q: 'Do you offer Golden Temple canvas wraps?',
        a: 'Yes! Our Golden Temple canvas wraps are printed on premium gallery-grade canvas stretched over solid wood frames. They arrive ready to hang and make a stunning focal point in any room.',
      },
      {
        q: 'Is a Golden Temple painting a good gift for a Sikh family?',
        a: 'Absolutely. A Golden Temple painting is a thoughtful and meaningful gift for housewarmings, weddings, Gurpurabs, and other special occasions. It represents faith, beauty, and cultural pride. Many of our customers purchase these as gifts for loved ones.',
      },
    ],
    relatedBlog: { slug: '/blog/golden-temple-harmandir-sahib', label: 'The Golden Temple: History of Harmandir Sahib' },
    relatedGlossary: { slug: '/glossary', label: 'Harmandir Sahib in the Sikh Glossary', anchor: 'Harmandir Sahib' },
    cta: 'Shop Golden Temple Prints',
  },

  'sikh-wedding-gifts': {
    title: 'Sikh Wedding Gifts — Unique Art & Decor for Anand Karaj | SikhiThreads',
    h1: 'Sikh Wedding Gifts',
    description:
      'Find unique Sikh wedding gifts and Anand Karaj presents. Beautiful crochet-style art, home decor, and personalized items for Sikh couples from SikhiThreads.',
    keywords:
      'sikh wedding gifts, anand karaj gifts, sikh wedding present, punjabi wedding gift, sikh couple gift, sikh marriage gift ideas, anand karaj ceremony gift',
    breadcrumbCategory: 'Gifts',
    productFilter: (p) =>
      /canvas|print|art/i.test(p.name) || /home|decor/i.test(p.name),
    searchQuery: 'gift',
    content: `Finding the perfect Sikh wedding gift can feel daunting, especially if you want to give something more meaningful than a generic gift card or household appliance. A Sikh wedding — the Anand Karaj ceremony — is a sacred and joyful event that unites two souls in the presence of Guru Granth Sahib Ji. The best Sikh wedding gifts honor this spiritual significance while also being practical and beautiful additions to the couple's new home.

SikhiThreads offers a range of thoughtful Sikh wedding gifts that celebrate faith, culture, and artistry. Our crochet-style Sikh art prints and canvas wraps make stunning gifts that the newlywed couple can proudly display in their home. A Golden Temple canvas wrap, a Mool Mantar calligraphy print, or a Guru Nanak Dev Ji art piece carries deep spiritual meaning and transforms any living space into a reflection of Sikh values.

Beyond wall art, our collection includes items like ceramic mugs with Sikh artwork, tote bags featuring Gurbani calligraphy, and digital download gift packs that let the couple choose their favorite wallpapers and prints. For a truly personal touch, consider our custom order option where we can create a personalized piece for the couple. Whether the wedding is a grand Anand Karaj celebration or an intimate gathering, a SikhiThreads gift shows thoughtfulness, cultural awareness, and genuine care. Browse our curated selection of Sikh wedding gift ideas below.`,
    faqs: [
      {
        q: 'What do you give at a Sikh wedding?',
        a: 'Traditional Sikh wedding gifts include cash in odd numbers (like $101 or $501), gold jewelry, and household items. For a more unique and personal gift, Sikh art prints, canvas wraps, and home decor items from SikhiThreads make meaningful presents that celebrate faith and culture.',
      },
      {
        q: 'What is an appropriate Sikh wedding gift?',
        a: 'An appropriate Sikh wedding gift is one that respects the spiritual nature of the Anand Karaj ceremony. Thoughtful options include Sikh art for the couple\'s new home, items featuring Gurbani calligraphy, or anything that helps them build a home rooted in Sikh values.',
      },
      {
        q: 'What is Anand Karaj?',
        a: 'Anand Karaj (meaning "blissful union") is the Sikh marriage ceremony. It takes place in the presence of Guru Granth Sahib Ji and involves the couple circling the holy scripture four times while hymns called Lavan are recited, symbolizing their spiritual journey together.',
      },
      {
        q: 'Can I customize a wedding gift from SikhiThreads?',
        a: 'Yes! We offer custom orders where we can create personalized crochet-style art for the couple. This could include their names in Gurmukhi script, a custom illustration of a meaningful Gurdwara, or any other personalized design. Contact us to discuss your custom gift idea.',
      },
      {
        q: 'Do you offer gift wrapping for Sikh wedding gifts?',
        a: 'Our products ship in premium packaging suitable for gift-giving. For special gift wrapping requests or personalized gift notes, please reach out to us through our contact page and we will do our best to accommodate.',
      },
    ],
    relatedGlossary: { slug: '/glossary', label: 'Anand Karaj in the Sikh Glossary', anchor: 'Anand Karaj' },
    cta: 'Shop Wedding Gifts',
  },

  'vaisakhi-decorations': {
    title: 'Vaisakhi Decorations — Art, Prints & Decor for Khalsa Sajna Diwas | SikhiThreads',
    h1: 'Vaisakhi Decorations',
    description:
      'Shop unique Vaisakhi decorations, art prints, and decor for Khalsa Sajna Diwas. Crochet-style Vaisakhi wall art, greeting cards, and celebration essentials from SikhiThreads.',
    keywords:
      'vaisakhi decorations, vaisakhi gifts, vaisakhi art, khalsa sajna diwas decorations, vaisakhi celebration, vaisakhi wall art, baisakhi decorations, vaisakhi party decor',
    breadcrumbCategory: 'Celebrations',
    productFilter: (p) =>
      /vaisakhi|baisakhi|khalsa|panj.?pyare|nagar.?kirtan/i.test(p.name) ||
      (p.collection_tags || []).some((t) => /vaisakhi/i.test(t)),
    searchQuery: 'vaisakhi',
    content: `Vaisakhi is one of the most important celebrations in the Sikh calendar. Commemorating the birth of the Khalsa in 1699 by Guru Gobind Singh Ji, Vaisakhi (also spelled Baisakhi) is a time of joy, unity, and renewal. Whether you are decorating your home, Gurdwara, or hosting a Vaisakhi gathering, the right decorations set the tone for a meaningful and festive celebration.

SikhiThreads offers a unique collection of Vaisakhi decorations that go beyond generic party supplies. Our crochet-aesthetic art prints capture the spirit of Vaisakhi — from vibrant depictions of Nagar Kirtan processions and the Panj Pyare to serene scenes of the first Amrit ceremony. These pieces work beautifully as wall art during the Vaisakhi season and year-round, making them a lasting investment rather than single-use decorations.

Our Vaisakhi collection includes canvas wraps for prominent display, art prints in multiple sizes, greeting card packs for sending warm wishes, and digital wallpaper packs so your devices can join the celebration too. Each piece is designed with authentic cultural understanding and our signature warm, textured style that makes Sikh stories feel alive. Whether you are planning a large community event or an intimate family celebration, SikhiThreads decorations add a touch of artistry and devotion to your Vaisakhi festivities. Explore our full Vaisakhi collection below and celebrate the Khalsa in style.`,
    faqs: [
      {
        q: 'What is Vaisakhi and when is it celebrated?',
        a: 'Vaisakhi (also called Baisakhi) is celebrated on April 13th or 14th each year. It marks the founding of the Khalsa by Guru Gobind Singh Ji in 1699 and is also a harvest festival celebrated across Punjab. It is one of the most important dates in the Sikh calendar.',
      },
      {
        q: 'What decorations do you need for Vaisakhi?',
        a: 'Popular Vaisakhi decorations include orange and blue themed items (representing the Khalsa colors), Sikh art prints featuring Vaisakhi scenes, Nishan Sahib flags, flower garlands, and banner displays. SikhiThreads offers art-focused decorations that combine cultural authenticity with beautiful design.',
      },
      {
        q: 'Can I use SikhiThreads Vaisakhi art year-round?',
        a: 'Absolutely! While our Vaisakhi collection features festive themes, the art is designed to be beautiful year-round. Canvas wraps and framed prints of Nagar Kirtan processions, the Panj Pyare, and other Vaisakhi scenes make stunning permanent additions to any home.',
      },
      {
        q: 'Do you have Vaisakhi greeting cards?',
        a: 'Yes! We offer Vaisakhi greeting card packs featuring our crochet-style art. These are perfect for sending warm wishes to family, friends, and community members during the Vaisakhi season.',
      },
    ],
    relatedBlog: { slug: '/blog/what-is-vaisakhi', label: 'What Is Vaisakhi? History & Significance' },
    relatedGlossary: { slug: '/glossary', label: 'Vaisakhi in the Sikh Glossary', anchor: 'Vaisakhi' },
    cta: 'Shop Vaisakhi Collection',
  },

  'sikh-home-decor': {
    title: 'Sikh Home Decor — Wall Art, Canvas, Prints & More | SikhiThreads',
    h1: 'Sikh Home Decor',
    description:
      'Shop beautiful Sikh home decor including wall art, canvas prints, and more. Unique crochet-style Sikh art that brings faith and beauty into your living space. Free shipping over $50.',
    keywords:
      'sikh home decor, sikh wall art, sikh art, sikh canvas art, sikh prints, sikh house decoration, sikh living room decor, sikh art prints',
    breadcrumbCategory: 'Home Decor',
    productFilter: (p) =>
      /canvas|print|art|decor/i.test(p.name),
    searchQuery: '',
    content: `Your home is a reflection of your values, your story, and your faith. For Sikh families, incorporating Sikh home decor creates a living space that nurtures spiritual connection and celebrates cultural identity. From the living room to the prayer room, the right pieces of Sikh art transform everyday spaces into sources of daily inspiration and pride.

SikhiThreads specializes in Sikh home decor that is both spiritually meaningful and aesthetically stunning. Our crochet-style art brings a unique warmth and texture to traditional Sikh imagery — the Golden Temple glows with handcrafted charm, Guru Nanak Dev Ji radiates serenity in rich earth tones, and scenes of Langar and Seva come alive with the cozy detail of woven thread. This distinctive style means your Sikh wall art will be a conversation starter and a cherished centerpiece, not just another mass-produced print.

Our Sikh home decor collection spans multiple categories and room settings. Large canvas wraps make dramatic statement pieces for living rooms and hallways. Framed art prints are perfect for bedrooms, offices, and prayer rooms. Ceramic mugs and tote bags carry Sikh art into your daily routines. And our digital downloads let you create custom arrangements that fit your unique space. Whether you are furnishing a new home, refreshing a room, or searching for the perfect housewarming gift for a Sikh family, SikhiThreads has pieces that honor tradition while embracing contemporary design. Browse our full collection below and bring the beauty of Sikhi into every corner of your home.`,
    faqs: [
      {
        q: 'What kind of Sikh home decor does SikhiThreads offer?',
        a: 'SikhiThreads offers a wide range of Sikh home decor including wall art canvas wraps, framed art prints, ceramic mugs, tote bags, phone cases, and digital downloads. All pieces feature our signature crochet-aesthetic art style.',
      },
      {
        q: 'Where should I hang Sikh wall art in my home?',
        a: 'Sikh wall art looks beautiful in living rooms, prayer rooms, hallways, bedrooms, and home offices. Many families place Golden Temple or Guru portraits in the main living area as a focal point. Prayer rooms often feature Mool Mantar calligraphy or Guru Granth Sahib imagery.',
      },
      {
        q: 'Do you offer free shipping on Sikh home decor?',
        a: 'Yes! SikhiThreads offers free shipping on all orders over $50 within the United States. International shipping is available at checkout with rates calculated based on your location.',
      },
      {
        q: 'Can I return Sikh art if it does not match my decor?',
        a: 'We want you to love your SikhiThreads purchase. If a piece does not work in your space, please contact us within 14 days of delivery and we will work with you on a return or exchange. Digital downloads are non-refundable.',
      },
      {
        q: 'What makes SikhiThreads Sikh art different from other stores?',
        a: 'SikhiThreads is the only Sikh art brand using a crochet-aesthetic style. Our pieces look and feel handcrafted, with warm textures and rich earth tones that set them apart from generic prints. Every piece is original artwork created with deep reverence for Sikh heritage.',
      },
    ],
    relatedBlog: { slug: '/blog/sikh-art-home-decorating-guide', label: 'Sikh Art Home Decorating Guide' },
    relatedGlossary: { slug: '/glossary', label: 'Browse the Sikh Glossary' },
    cta: 'Shop All Sikh Decor',
  },
}

// ---------------------------------------------------------------------------
// FAQ Accordion Component
// ---------------------------------------------------------------------------
function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border-b border-gold-light/30 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left cursor-pointer bg-transparent border-none"
      >
        <span className="font-heading text-lg font-semibold text-charcoal pr-4">{question}</span>
        {isOpen ? (
          <ChevronUp size={20} className="text-gold flex-shrink-0" />
        ) : (
          <ChevronDown size={20} className="text-warm-gray flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="pb-5 pr-8">
          <p className="text-charcoal-light leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Landing Page Component
// ---------------------------------------------------------------------------
export default function LandingPage() {
  const { slug } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [openFAQ, setOpenFAQ] = useState(0)

  const config = LANDING_PAGES[slug]

  useEffect(() => {
    if (!config) return
    setLoading(true)
    const query = config.searchQuery
      ? `/api/products?search=${encodeURIComponent(config.searchQuery)}&limit=20`
      : '/api/products?limit=20'
    api
      .get(query)
      .then((data) => {
        const all = data.products || data || []
        const filtered = config.productFilter ? all.filter(config.productFilter) : all
        setProducts(filtered.length > 0 ? filtered.slice(0, 8) : all.slice(0, 8))
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
    window.scrollTo(0, 0)
  }, [slug, config])

  // 404 for unknown slugs
  if (!config) {
    return (
      <div className="bg-cream min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-charcoal mb-4">Page Not Found</h1>
          <Link to="/" className="text-gold hover:text-gold-dark font-semibold no-underline">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  // Breadcrumbs data
  const breadcrumbs = [
    { name: 'Home', url: 'https://sikhithreads.com/' },
    { name: config.breadcrumbCategory, url: `https://sikhithreads.com/shop` },
    { name: config.h1, url: `https://sikhithreads.com/l/${slug}` },
  ]

  // WebPage JSON-LD
  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: config.h1,
    description: config.description,
    url: `https://sikhithreads.com/l/${slug}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: b.name,
        item: b.url,
      })),
    },
  }

  // FAQ JSON-LD
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  }

  // Split content into paragraphs
  const paragraphs = config.content.split('\n\n').filter(Boolean)

  return (
    <div className="bg-cream min-h-screen">
      <SEO
        title={config.title}
        description={config.description}
        keywords={config.keywords}
        url={`https://sikhithreads.com/l/${slug}`}
        jsonLd={webPageJsonLd}
        breadcrumbs={breadcrumbs}
      />

      {/* FAQ Schema — separate script tag */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2"
      >
        <ol className="flex items-center gap-2 text-sm text-warm-gray">
          <li className="flex items-center gap-1">
            <Home size={14} />
            <Link to="/" className="hover:text-brown no-underline text-warm-gray transition-colors">
              Home
            </Link>
          </li>
          <li className="flex items-center gap-1">
            <span>/</span>
            <Link to="/shop" className="hover:text-brown no-underline text-warm-gray transition-colors">
              {config.breadcrumbCategory}
            </Link>
          </li>
          <li className="flex items-center gap-1">
            <span>/</span>
            <span className="text-charcoal font-medium">{config.h1}</span>
          </li>
        </ol>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-charcoal via-brown-dark to-charcoal">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 50%, rgba(212,165,116,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(139,111,71,0.2) 0%, transparent 50%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-cream leading-tight mb-6">
            {config.h1}
          </h1>
          <p className="text-cream/70 text-lg sm:text-xl max-w-2xl mx-auto font-light">
            {config.description}
          </p>
          <div className="mt-8">
            <a
              href="#products"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-warm-white px-8 py-4 rounded-lg text-base font-semibold transition-all no-underline shadow-lg hover:shadow-xl"
            >
              {config.cta} <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-charcoal prose-p:text-charcoal-light prose-p:leading-relaxed">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {/* Internal links */}
        <div className="mt-8 flex flex-wrap gap-4">
          {config.relatedBlog && (
            <Link
              to={config.relatedBlog.slug}
              className="inline-flex items-center gap-2 text-brown hover:text-brown-dark font-semibold text-sm no-underline transition-colors bg-cream-dark px-4 py-2 rounded-lg"
            >
              Read: {config.relatedBlog.label} <ArrowRight size={14} />
            </Link>
          )}
          {config.relatedGlossary && (
            <Link
              to={config.relatedGlossary.slug}
              className="inline-flex items-center gap-2 text-brown hover:text-brown-dark font-semibold text-sm no-underline transition-colors bg-cream-dark px-4 py-2 rounded-lg"
            >
              {config.relatedGlossary.label} <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <p className="text-gold text-sm font-medium tracking-[0.15em] uppercase mb-2">
            Shop
          </p>
          <h2 className="font-heading text-3xl font-bold text-charcoal">
            {config.h1} — Our Collection
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-warm-gray">
            <p>Products coming soon. Follow us for updates.</p>
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-brown hover:text-brown-dark font-semibold no-underline transition-colors"
          >
            View All Products <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <p className="text-gold text-sm font-medium tracking-[0.15em] uppercase mb-2">FAQ</p>
          <h2 className="font-heading text-3xl font-bold text-charcoal">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="bg-warm-white rounded-xl shadow-sm border border-gold-light/20 px-6 md:px-8">
          {config.faqs.map((faq, i) => (
            <FAQItem
              key={i}
              question={faq.q}
              answer={faq.a}
              isOpen={openFAQ === i}
              onToggle={() => setOpenFAQ(openFAQ === i ? -1 : i)}
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-charcoal text-cream py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">
            Bring Sikhi Into Your Home
          </h2>
          <p className="text-warm-gray text-lg mb-8">
            Explore our complete collection of Sikh art prints, canvas wraps, digital
            downloads, and more — each piece crafted with love and reverence.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-warm-white px-8 py-4 rounded-lg font-semibold no-underline transition-colors"
          >
            {config.cta} <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}

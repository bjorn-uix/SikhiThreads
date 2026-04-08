import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

const SITE_NAME = 'SikhiThreads'
const DEFAULT_IMAGE = 'https://sikhithreads.com/og-default.png'
const SITE_URL = 'https://sikhithreads.com'

const HREFLANG_LOCALES = ['en-us', 'en-gb', 'en-ca', 'en-in', 'en-au']

export default function SEO({
  title,
  description,
  keywords,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  jsonLd,
  noindex = false,
  breadcrumbs,
}) {
  const fullTitle = title || SITE_NAME
  const location = useLocation()
  const currentPath = location.pathname

  const breadcrumbJsonLd = breadcrumbs && breadcrumbs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  } : null

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {url && <link rel="canonical" href={url} />}

      {/* Hreflang Tags for International SEO */}
      {HREFLANG_LOCALES.map(locale => (
        <link key={locale} rel="alternate" hrefLang={locale} href={`${SITE_URL}${currentPath}`} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}${currentPath}`} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={image} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data */}
      {jsonLd && Array.isArray(jsonLd) ? (
        jsonLd.map((ld, i) => (
          <script key={i} type="application/ld+json">
            {JSON.stringify(ld)}
          </script>
        ))
      ) : jsonLd ? (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      ) : null}

      {/* Breadcrumb JSON-LD */}
      {breadcrumbJsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbJsonLd)}
        </script>
      )}
    </Helmet>
  )
}

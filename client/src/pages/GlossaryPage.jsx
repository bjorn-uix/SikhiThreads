import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronDown, ChevronUp, BookOpen } from 'lucide-react'
import SEO from '../components/SEO'
import { api } from '../lib/api'

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'beliefs', label: 'Beliefs' },
  { value: 'practices', label: 'Practices' },
  { value: 'people', label: 'People' },
  { value: 'places', label: 'Places' },
  { value: 'scripture', label: 'Scripture' },
  { value: 'festivals', label: 'Festivals' },
  { value: 'symbols', label: 'Symbols' },
  { value: 'general', label: 'General' },
]

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function TermCard({ term, isExpanded, onToggle }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between p-5 text-left hover:bg-gold-light/10 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-heading text-lg font-bold text-charcoal">{term.term}</h3>
            {term.pronunciation && (
              <span className="text-warm-gray text-sm italic">({term.pronunciation})</span>
            )}
          </div>
          {!isExpanded && (
            <p className="text-charcoal-light text-sm line-clamp-2">{term.definition}</p>
          )}
        </div>
        <div className="ml-4 mt-1 text-warm-gray flex-shrink-0">
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {isExpanded && (
        <div className="px-5 pb-5 border-t border-gold-light/20 pt-4">
          <p className="text-charcoal-light leading-relaxed mb-4">{term.definition}</p>

          {term.category && (
            <div className="mb-3">
              <span className="text-xs font-semibold tracking-wider uppercase text-gold bg-gold-light/20 px-3 py-1 rounded-full">
                {term.category}
              </span>
            </div>
          )}

          {term.related_terms && term.related_terms.length > 0 && (
            <div className="mt-4">
              <span className="text-sm font-medium text-warm-gray">Related terms: </span>
              <span className="text-sm text-charcoal-light">
                {term.related_terms.join(', ')}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function GlossaryPage() {
  const [terms, setTerms] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [activeLetter, setActiveLetter] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    async function fetchTerms() {
      setLoading(true)
      try {
        const data = await api.get('/api/glossary')
        setTerms(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to fetch glossary terms:', err)
        setTerms([])
      } finally {
        setLoading(false)
      }
    }
    fetchTerms()
  }, [])

  // Available letters (letters that have at least one term)
  const availableLetters = useMemo(() => {
    const letterSet = new Set(terms.map(t => t.term[0].toUpperCase()))
    return LETTERS.map(l => ({ letter: l, available: letterSet.has(l) }))
  }, [terms])

  // Filtered terms
  const filteredTerms = useMemo(() => {
    return terms.filter(term => {
      if (category && term.category !== category) return false
      if (activeLetter && !term.term.toUpperCase().startsWith(activeLetter)) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          term.term.toLowerCase().includes(q) ||
          term.definition.toLowerCase().includes(q) ||
          (term.pronunciation && term.pronunciation.toLowerCase().includes(q))
        )
      }
      return true
    })
  }, [terms, category, activeLetter, search])

  // Group by letter
  const groupedTerms = useMemo(() => {
    const groups = {}
    filteredTerms.forEach(term => {
      const letter = term.term[0].toUpperCase()
      if (!groups[letter]) groups[letter] = []
      groups[letter].push(term)
    })
    return groups
  }, [filteredTerms])

  const sortedLetters = Object.keys(groupedTerms).sort()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Sikh Glossary',
    description: 'A comprehensive glossary of Sikh terms, concepts, and traditions.',
    url: 'https://sikhithreads.com/glossary',
    definedTerm: terms.map(t => ({
      '@type': 'DefinedTerm',
      name: t.term,
      description: t.definition,
      ...(t.pronunciation ? { alternateName: t.pronunciation } : {}),
      inDefinedTermSet: 'https://sikhithreads.com/glossary',
    })),
  }

  return (
    <div className="bg-cream min-h-screen">
      <SEO
        title="Sikh Glossary — Understanding Sikh Terms & Concepts | SikhiThreads"
        description="A comprehensive glossary of Sikh terms, concepts, and traditions. Learn the meaning of Waheguru, Gurdwara, Langar, Khalsa, and more."
        keywords="sikh glossary, sikh terms, sikh definitions, waheguru meaning, gurdwara meaning, langar meaning, khalsa meaning, sikh vocabulary"
        url="https://sikhithreads.com/glossary"
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <div className="bg-charcoal text-cream py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/20 rounded-full mb-6">
            <BookOpen size={28} className="text-gold" />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Sikh Glossary</h1>
          <p className="text-warm-gray text-lg max-w-2xl mx-auto">
            A comprehensive guide to Sikh terms, concepts, and traditions. Explore the rich vocabulary
            of Sikhi and deepen your understanding of the faith.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" />
          <input
            type="text"
            placeholder="Search terms..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setActiveLetter('') }}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-gold-light/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 text-charcoal placeholder:text-warm-gray"
          />
        </div>

        {/* A-Z Navigation */}
        <div className="flex flex-wrap gap-1 mb-6">
          <button
            onClick={() => setActiveLetter('')}
            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
              activeLetter === ''
                ? 'bg-gold text-warm-white'
                : 'bg-white text-charcoal-light hover:bg-gold-light/30'
            }`}
          >
            All
          </button>
          {availableLetters.map(({ letter, available }) => (
            <button
              key={letter}
              onClick={() => { if (available) { setActiveLetter(activeLetter === letter ? '' : letter); setSearch('') } }}
              disabled={!available}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                activeLetter === letter
                  ? 'bg-gold text-warm-white'
                  : available
                    ? 'bg-white text-charcoal-light hover:bg-gold-light/30'
                    : 'bg-white/50 text-warm-gray/40 cursor-not-allowed'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === cat.value
                  ? 'bg-gold text-warm-white'
                  : 'bg-white text-charcoal-light hover:bg-gold-light/30 hover:text-brown'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Terms List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-5 animate-pulse">
                <div className="h-5 bg-gold-light/20 rounded w-1/3 mb-2" />
                <div className="h-4 bg-gold-light/20 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : filteredTerms.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-warm-gray text-lg">No terms found matching your search.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedLetters.map(letter => (
              <div key={letter}>
                <h2 className="font-heading text-2xl font-bold text-gold mb-4 sticky top-20 bg-cream py-2 z-10">
                  {letter}
                </h2>
                <div className="space-y-3">
                  {groupedTerms[letter].map(term => (
                    <TermCard
                      key={term.id}
                      term={term}
                      isExpanded={expandedId === term.id}
                      onToggle={() => setExpandedId(expandedId === term.id ? null : term.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-warm-gray mb-4">
            Want to see more Sikh content? Check out our blog for in-depth articles.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-gold hover:text-gold-dark font-semibold no-underline transition-colors"
          >
            Visit our Blog <BookOpen size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}

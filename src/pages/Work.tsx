import { useRef } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useSiteMotion } from '../animation/useSiteMotion'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { EnquiryBand, Figure, PageIntro } from '../components/Bits'
import { CATEGORIES, categoryLabel, filterCollections, isCategory } from '../data/collections'

/**
 * The filter lives in the URL (?category=weddings), so Back, refresh and shared links all
 * keep it. Filters are plain links: each choice is a history entry, and they work without
 * any extra state. An unknown value shows everything rather than an empty page.
 */
export default function Work() {
  const root = useRef<HTMLDivElement>(null)
  useSiteMotion(root)
  const [params] = useSearchParams()
  const raw = params.get('category')
  const active = isCategory(raw) ? raw : null
  const shown = filterCollections(active)
  useDocumentTitle(active ? `${categoryLabel(active)} · Our work` : 'Our work')

  return (
    <div ref={root}>
      <PageIntro title="Our work">
        <p>Four concept collections, one for each kind of occasion. Each uses a single AI-generated illustrative image and a detail from it, to show how Oakwood’s own photographs could be presented.</p>
      </PageIntro>

      <section className="section section--top-tight" aria-labelledby="work-results">
        <div className="container">
          <nav className="filters" aria-label="Filter by occasion">
            <ul>
              <li><Link to="/work" className="filter" aria-current={active === null ? 'true' : undefined}>All</Link></li>
              {CATEGORIES.map(category => (
                <li key={category.id}>
                  <Link to={`/work?category=${category.id}`} className="filter" aria-current={active === category.id ? 'true' : undefined}>{category.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <h2 id="work-results" className="visually-hidden">Concept collections</h2>
          <p className="filters__status" role="status">
            {active ? `Showing the ${categoryLabel(active).toLowerCase()} concept.` : `Showing all ${shown.length} concepts.`}
          </p>

          <ul className="work-list">
            {shown.map(collection => (
              <li key={collection.slug} className="work-item">
                <Link to={`/work/${collection.slug}`} className="work-item__link">
                  <Figure name={collection.image.name} alt={collection.image.alt} sizes="(min-width: 900px) 58vw, 100vw" />
                  <div className="work-item__text">
                    <p className="work-item__category">{categoryLabel(collection.category)}</p>
                    <h3 className="work-item__title">{collection.title} <span className="concept-label">Concept</span></h3>
                    <p>{collection.line}</p>
                    <span className="text-link" aria-hidden="true">View the collection</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <EnquiryBand />
    </div>
  )
}

import { useRef } from 'react'
import { Link, useParams } from 'react-router'
import { useSiteMotion } from '../animation/useSiteMotion'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { EnquiryBand, Figure, PageIntro } from '../components/Bits'
import { CATEGORIES, categoryLabel, findCollection, nextCollection } from '../data/collections'
import NotFound from './NotFound'

export default function CollectionDetail() {
  const { slug } = useParams()
  const collection = findCollection(slug)
  useDocumentTitle(collection ? `${collection.title} (concept)` : 'Collection not found')
  if (!collection) return <NotFound what="collection" />
  return <Detail key={collection.slug} slug={collection.slug} />
}

function Detail({ slug }: { slug: string }) {
  const root = useRef<HTMLDivElement>(null)
  useSiteMotion(root)
  const collection = findCollection(slug)!
  const next = nextCollection(slug)
  const category = CATEGORIES.find(item => item.id === collection.category)!
  const enquire = `/plan?occasion=${category.occasion}`

  return (
    <div ref={root}>
      <PageIntro
        crumbs={[{ to: '/work', label: 'Our work' }, { to: `/work?category=${collection.category}`, label: categoryLabel(collection.category) }]}
        title={<>{collection.title} <span className="concept-label concept-label--large">Concept</span></>}
      >
        <p>{collection.line}</p>
        <p className="concept-note">An illustrative concept collection. The images are AI-generated and do not show an event Oakwood has delivered.</p>
      </PageIntro>

      <div className="container collection">
        <Figure className="collection__hero" name={collection.image.name} alt={collection.image.alt} sizes="(min-width: 1300px) 1240px, 100vw" priority reveal={false} />

        <div className="collection__body">
          <section className="collection__story" aria-labelledby="story-title">
            <h2 id="story-title" className="collection__heading">The design idea</h2>
            {collection.narrative.map(paragraph => <p key={paragraph.slice(0, 24)} data-anim="rise">{paragraph}</p>)}
          </section>
          <section className="collection__notes" aria-labelledby="notes-title">
            <h2 id="notes-title" className="collection__heading">Design notes</h2>
            <dl>
              {collection.notes.map(note => <div key={note.label}><dt>{note.label}</dt><dd>{note.value}</dd></div>)}
            </dl>
            <Link to={enquire} className="button button--primary">Enquire about a {category.noun}</Link>
          </section>
        </div>

        <Figure className="collection__detail" name={collection.detail.name} alt={collection.detail.alt} sizes="(min-width: 900px) 40vw, 100vw" caption={`${collection.detail.caption} Illustrative, not Oakwood’s work.`} />
      </div>

      <nav className="next-collection" aria-label="Next collection">
        <div className="container">
          <Link to={`/work/${next.slug}`} className="next-collection__link">
            <span className="next-collection__label">Next concept</span>
            <span className="next-collection__title">{next.title}</span>
            <span className="next-collection__category">{categoryLabel(next.category)}</span>
          </Link>
        </div>
      </nav>

      <EnquiryBand to={enquire} title="Planning something like this?">
        <p>Start an enquiry with the occasion already chosen. It is a demo in this concept, so nothing is sent.</p>
      </EnquiryBand>
    </div>
  )
}

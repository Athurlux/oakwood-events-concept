import { Link } from 'react-router'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { COLLECTIONS } from '../data/collections'

export default function NotFound({ what = 'page' }: { what?: 'page' | 'collection' }) {
  useDocumentTitle(what === 'collection' ? 'Collection not found' : 'Page not found')
  return (
    <section className="container section not-found" aria-labelledby="nf-title">
      <h1 id="nf-title" className="not-found__title">{what === 'collection' ? 'We couldn’t find that collection.' : 'This page isn’t here.'}</h1>
      <p>The link may be mistyped, or the page may have moved. These might help:</p>
      <ul className="not-found__links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/work">Our work</Link></li>
        {COLLECTIONS.map(collection => <li key={collection.slug}><Link to={`/work/${collection.slug}`}>{collection.title} (concept)</Link></li>)}
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/plan">Plan your event</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </section>
  )
}

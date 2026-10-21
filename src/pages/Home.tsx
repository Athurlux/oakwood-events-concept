import { useRef } from 'react'
import { Link } from 'react-router'
import { useSiteMotion } from '../animation/useSiteMotion'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { srcSet } from '../components/Img'
import { EnquiryBand, Figure } from '../components/Bits'
import { CATEGORIES, COLLECTIONS } from '../data/collections'
import { business } from '../data/business'
import manifest from '../data/image-manifest.json'

const PROCESS = [
  { title: 'Enquiry', text: 'You share the occasion, a date if you have one, and how you’d like to hear back.' },
  { title: 'Conversation', text: 'A discussion of your vision: the mood, the setting, the people and the traditions that matter.' },
  { title: 'Proposal and refinement', text: 'A considered proposal, adjusted together until it feels right and fits the budget.' },
  { title: 'The day', text: 'Setting up, styling and flowers delivered on time, so you can be a guest at your own event.' },
]

export default function Home() {
  const root = useRef<HTMLDivElement>(null)
  useSiteMotion(root)
  useDocumentTitle(null)
  const featured = [COLLECTIONS[0], COLLECTIONS[2]]

  return (
    <div ref={root}>
      {/* ---- Hero: art-directed photographs, live headline over the shaded side ---- */}
      <section className="hero" aria-labelledby="hero-title">
        <picture className="hero__media">
          <source media="(max-width: 767px)" srcSet={srcSet('hero-mobile')} sizes="100vw" width={manifest['hero-mobile'].width} height={manifest['hero-mobile'].height} />
          <img
            data-hero="photo"
            src="/images/hero-desktop-1280.webp" srcSet={srcSet('hero-desktop')} sizes="100vw"
            width={manifest['hero-desktop'].width} height={manifest['hero-desktop'].height}
            alt="" fetchPriority="high" decoding="async"
          />
        </picture>
        <div className="hero__shade" aria-hidden="true" />
        <div className="container hero__content">
          <h1 className="hero__title" id="hero-title">
            <span className="hero__line"><span data-hero="line">Beautifully considered.</span></span>
            <span className="hero__line"><span data-hero="line">Unforgettably yours.</span></span>
          </h1>
          <p className="hero__lede" data-hero="lede">Event planning, styling and fresh, garden-style florals for weddings, traditional ceremonies and celebrations across Uganda.</p>
          <div className="hero__actions" data-hero="actions">
            <Link to="/work" className="button button--light">Explore the concept</Link>
            <Link to="/plan" className="button button--on-dark">Plan your event</Link>
          </div>
        </div>
        <p className="hero__caption">Illustrative concept image, not Oakwood’s work.</p>
      </section>

      {/* ---- Editorial introduction ---- */}
      <section className="section intro" aria-labelledby="intro-title">
        <div className="container intro__grid">
          <h2 className="intro__title" id="intro-title" data-anim="rise">Style and practicality, in equal measure.</h2>
          <div className="intro__body" data-anim="rise">
            <p className="intro__lead">Since {business.since}, Oakwood Events Uganda has offered event planning and management, event styling and decoration, and fresh, garden-style floral design, from Ntinda, Kampala.</p>
            <p>The company is led by Stella and Charlotte. This concept imagines a website that lets that work breathe: unhurried pages, real enquiry questions, and room for photographs.</p>
            <Link to="/about" className="text-link">About Oakwood</Link>
          </div>
        </div>
      </section>

      {/* ---- Four occasions: a typographic index, each opening its concept collection ---- */}
      <section className="section section--tint" aria-labelledby="occasions-title">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title" id="occasions-title">Four kinds of occasion</h2>
            <p>One concept collection for each, showing how the site would present Oakwood’s own photographs once they are in place.</p>
          </div>
          <ul className="occasion-index">
            {CATEGORIES.map(category => {
              const collection = COLLECTIONS.find(item => item.category === category.id)!
              return (
                <li key={category.id} data-anim="rise">
                  <Link to={`/work/${collection.slug}`} className="occasion-index__link">
                    <span className="occasion-index__name">{category.label}</span>
                    <span className="occasion-index__line">{collection.line}</span>
                    <span className="occasion-index__go" aria-hidden="true">View concept</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* ---- Floral craft moment ---- */}
      <section className="section floral" aria-labelledby="floral-title">
        <div className="container floral__grid">
          <Figure className="floral__figure" name="floral" sizes="(min-width: 900px) 42vw, 100vw"
            alt="Concept image: white garden roses, spray roses and white blossom with green leaves in a stone urn, in soft light."
            caption="Illustrative concept image, not Oakwood’s floral work." />
          <div className="floral__text">
            <h2 className="floral__title" id="floral-title" data-anim="rise">Flowers that look gathered, not arranged.</h2>
            <div data-anim="rise">
              <p>Garden-style floristry is at the heart of Oakwood: loose, generous arrangements built from fresh flowers and greenery. Their own site lists bridal bouquets, floral gift baskets, and garden-style florals for homes, offices and hotels.</p>
              <Link to="/services#florals" className="text-link">Flowers by Oakwood</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Process (a real sequence, so it is numbered) ---- */}
      <section className="section section--olive process" aria-labelledby="process-title">
        <div className="container">
          <div className="section-head section-head--light">
            <h2 className="section-title" id="process-title">From first message to the day itself</h2>
            <p>A proposed outline for the site. The first steps follow Oakwood’s own published process; the rest is for Oakwood to confirm.</p>
          </div>
          <ol className="process__list">
            {PROCESS.map((step, index) => (
              <li key={step.title} className="process__step" data-anim="rise">
                <span className="process__num" aria-hidden="true">{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- Selected concepts ---- */}
      <section className="section" aria-labelledby="selected-title">
        <div className="container">
          <div className="section-head section-head--row">
            <div>
              <h2 className="section-title" id="selected-title">Selected concepts</h2>
              <p>Illustrative collections: a direction for each kind of occasion, not a record of past events.</p>
            </div>
            <Link to="/work" className="text-link">All four concepts</Link>
          </div>
          <div className="feature-pair">
            {featured.map(collection => (
              <article key={collection.slug} className="feature">
                <Link to={`/work/${collection.slug}`} className="feature__link">
                  <Figure name={collection.image.name} alt={collection.image.alt} sizes="(min-width: 900px) 46vw, 100vw" />
                  <h3 className="feature__title">{collection.title} <span className="concept-label">Concept</span></h3>
                </Link>
                <p className="feature__line">{collection.line}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <EnquiryBand />
    </div>
  )
}

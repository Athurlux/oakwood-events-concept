import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Img, type ImageName } from './Img'

/**
 * Every photograph is AI-generated, so every figure carries a visible caption saying so.
 * `reveal` opts the frame into the scroll mask reveal (see useSiteMotion).
 */
export function Figure({ name, alt, sizes, caption = 'Illustrative concept image, not Oakwood’s work.', priority, reveal = true, className = '' }: {
  name: ImageName; alt: string; sizes: string; caption?: string; priority?: boolean; reveal?: boolean; className?: string
}) {
  return (
    <figure className={`figure ${className}`}>
      <div className="figure__frame" data-anim={reveal ? 'scene' : undefined}>
        <Img name={name} alt={alt} sizes={sizes} priority={priority} />
      </div>
      <figcaption className="figure__caption">{caption}</figcaption>
    </figure>
  )
}

export function PageIntro({ title, children, crumbs }: { title: ReactNode; children?: ReactNode; crumbs?: { to: string; label: string }[] }) {
  return (
    <header className="page-intro">
      <div className="container">
        {crumbs && (
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol>
              {crumbs.map(crumb => <li key={crumb.to}><Link to={crumb.to}>{crumb.label}</Link></li>)}
            </ol>
          </nav>
        )}
        <h1 className="page-intro__title">{title}</h1>
        {children && <div className="page-intro__lede">{children}</div>}
      </div>
    </header>
  )
}

/** Closing invitation used at the foot of most pages. */
export function EnquiryBand({ title = 'Tell us about your celebration.', to = '/plan', children }: { title?: string; to?: string; children?: ReactNode }) {
  return (
    <section className="enquiry-band" aria-labelledby="enquiry-band-title">
      {/* Decorative only: hidden from assistive tech, ignores the pointer, kept clear of the actions. */}
      <img className="enquiry-band__corner" data-anim="corner" src="/images/floral-corner-720.webp"
        srcSet="/images/floral-corner-360.webp 360w, /images/floral-corner-720.webp 720w" sizes="(min-width: 900px) 30vw, 0px"
        width={1312} height={1199} alt="" aria-hidden="true" loading="lazy" decoding="async" />
      <div className="container enquiry-band__inner">
        <h2 id="enquiry-band-title" className="enquiry-band__title">{title}</h2>
        <div className="enquiry-band__body">
          {children ?? <p>A short guided enquiry: the occasion, the date if you have one, and how you’d like to hear back. In this concept it is a demo, and nothing is sent.</p>}
          <Link to={to} className="button button--light">Plan your event</Link>
        </div>
      </div>
    </section>
  )
}

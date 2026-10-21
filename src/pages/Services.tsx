import { useRef } from 'react'
import { Link } from 'react-router'
import { useSiteMotion } from '../animation/useSiteMotion'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { EnquiryBand, Figure, PageIntro } from '../components/Bits'
import { SERVICES } from '../data/services'
import { publishedProcess } from '../data/business'

export default function Services() {
  const root = useRef<HTMLDivElement>(null)
  useSiteMotion(root)
  useDocumentTitle('Services')

  return (
    <div ref={root}>
      <PageIntro title="Services">
        <p>Oakwood names three services on its own website. Each can be enquired about on its own or together.</p>
        <p className="concept-note">The service names and floral offerings are Oakwood’s. The short descriptions are proposed wording for Oakwood to confirm or correct.</p>
      </PageIntro>

      {SERVICES.map((service, index) => (
        <section key={service.id} id={service.id} className={`section service ${index % 2 ? 'section--tint' : ''}`} aria-labelledby={`${service.id}-title`}>
          <div className="container service__grid">
            <div className="service__text">
              <h2 className="service__title" id={`${service.id}-title`} data-anim="rise">{service.name}</h2>
              <p className="service__summary" data-anim="rise">{service.summary}</p>

              {service.published && (
                <div className="service__published" data-anim="rise">
                  <h3>Listed on Oakwood’s site</h3>
                  <ul className="plain-list">{service.published.map(item => <li key={item}>{item}</li>)}</ul>
                </div>
              )}

              <div className="service__covers" data-anim="rise">
                <h3>An enquiry for this covers</h3>
                <ul className="plain-list">{service.covers.map(item => <li key={item}>{item}</li>)}</ul>
              </div>
              <Link to={`/plan?service=${service.id}`} className="button button--primary">Enquire about {service.name.toLowerCase().replace('flowers by oakwood', 'flowers')}</Link>
            </div>
            <Figure className="service__figure" name={service.image.name} alt={service.image.alt} caption={service.image.caption} sizes="(min-width: 900px) 40vw, 100vw" />
          </div>
        </section>
      ))}

      <section className="section section--tint" aria-labelledby="how-title">
        <div className="container how">
          <div className="section-head">
            <h2 className="section-title" id="how-title">How an enquiry begins</h2>
            <p>These first steps are how Oakwood described its own process. Later stages, consultation, proposal, refinement and the event itself, are proposed wording for the site.</p>
          </div>
          <ol className="how__list">
            {publishedProcess.map(step => <li key={step} data-anim="rise">{step}</li>)}
          </ol>
        </div>
      </section>

      <EnquiryBand />
    </div>
  )
}

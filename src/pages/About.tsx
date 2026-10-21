import { useRef } from 'react'
import { Link } from 'react-router'
import { useSiteMotion } from '../animation/useSiteMotion'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { EnquiryBand, Figure, PageIntro } from '../components/Bits'
import { business, documentedEventTypes, nameStory, SOURCE_NOTE } from '../data/business'

export default function About() {
  const root = useRef<HTMLDivElement>(null)
  useSiteMotion(root)
  useDocumentTitle('About')

  return (
    <div ref={root}>
      <PageIntro title="About Oakwood">
        <p>Oakwood Events Uganda has been planning, styling and creating floral designs for celebrations since {business.since}. It is led by Stella and Charlotte, who put style and practicality at the heart of the work.</p>
      </PageIntro>

      <section className="section section--top-tight" aria-labelledby="name-title">
        <div className="container about-name">
          <h2 className="about-name__title" id="name-title" data-anim="rise">Why “Oakwood”</h2>
          <div className="about-name__body" data-anim="rise">
            <p>The name was Stella’s idea. Oak is one of the heaviest, most durable hardwoods, and also one of the easiest to shape into pieces that last for decades.</p>
            <p>Those qualities became the values the company set out to stand for: {nameStory.values.slice(0, -1).join(', ')} and {nameStory.values.at(-1)}.</p>
          </div>
        </div>
      </section>

      <section className="section section--tint" aria-labelledby="leads-title">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title" id="leads-title">Led by Stella and Charlotte</h2>
            <p>Together they bring more than a decade of experience in project planning, management and business administration, according to Oakwood’s own site.</p>
          </div>
          <div className="leads">
            {business.leads.map(lead => (
              <article key={lead.name} className="lead" data-anim="rise">
                <h3 className="lead__name">{lead.name}</h3>
                <p className="lead__role">{lead.role}</p>
                <p>{lead.focus}</p>
              </article>
            ))}
          </div>
          <p className="fine-print about__note">No team photographs are shown: none were supplied for this concept, and none have been generated.</p>
        </div>
      </section>

      <section className="section" aria-labelledby="approach-title">
        <div className="container approach">
          <Figure className="approach__figure" name="floral" sizes="(min-width: 900px) 36vw, 100vw"
            alt="Concept image: white garden roses and white blossom with green leaves in a stone urn."
            caption="Illustrative concept image, not Oakwood’s floral work." />
          <div className="approach__text">
            <h2 className="section-title" id="approach-title" data-anim="rise">The occasions Oakwood works on</h2>
            <p data-anim="rise">Oakwood’s own portfolio and floral pages have covered:</p>
            <ul className="plain-list" data-anim="rise">{documentedEventTypes.map(item => <li key={item}>{item}</li>)}</ul>
            <p data-anim="rise">This concept doesn’t republish that portfolio or its client stories. A finished site would show Oakwood’s real photographs, with permission, in place of the illustrative images used here.</p>
          </div>
        </div>
      </section>

      <section className="section section--tint" id="concept" aria-labelledby="concept-title">
        <div className="container concept">
          <h2 className="section-title" id="concept-title">About this concept</h2>
          <div className="concept__body">
            <p>This is an independent website redesign proposal by Arthur Kitandwe. It is not Oakwood Events Uganda’s official website, and Oakwood has not authorised or reviewed it.</p>
            <ul className="plain-list">
              <li>All photographs are AI-generated illustrations. They are not Oakwood’s portfolio, venues, clients or floral work.</li>
              <li>The wordmark and favicon are proposed concept assets, not Oakwood’s official identity.</li>
              <li>Forms are demonstrations. Nothing entered is stored, sent or seen by anyone.</li>
              <li>Business details come from Oakwood’s own published pages. {SOURCE_NOTE}</li>
            </ul>
            <Link to="/contact" className="button button--outline">Oakwood’s published contact details</Link>
          </div>
        </div>
      </section>

      <EnquiryBand />
    </div>
  )
}

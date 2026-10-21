import { Link } from 'react-router'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { PageIntro } from '../components/Bits'
import { FormFlow } from '../forms/FormFlow'
import { contactFlow } from '../forms/flows'
import { business, SOURCE_NOTE } from '../data/business'

export default function Contact() {
  useDocumentTitle('Contact')

  return (
    <>
      <PageIntro title="Contact">
        <p>For a new event, the <Link to="/plan">guided enquiry</Link> asks the useful questions up front. For anything else, a short message is enough.</p>
      </PageIntro>

      <div className="container section section--top-tight contact">
        <section className="real-contact" aria-labelledby="real-contact-title">
          <h2 id="real-contact-title" className="real-contact__title">Reach Oakwood directly</h2>
          <p className="real-contact__note">These are Oakwood Events Uganda’s own published details. Using them contacts the real business, separately from this demo.</p>
          <dl className="real-contact__list">
            <div><dt>Address</dt><dd>{business.address}</dd></div>
            <div><dt>Email</dt><dd><a href={`mailto:${business.email}`}>{business.email}</a></dd></div>
            <div><dt>Phone</dt><dd>{business.phones.map(phone => <a key={phone.href} href={phone.href}>{phone.display}</a>)}</dd></div>
            <div><dt>Social</dt><dd>{business.profiles.map(profile => (
              <a key={profile.href} href={profile.href} target="_blank" rel="noopener noreferrer">{profile.label} {profile.handle}<span className="visually-hidden"> (opens in a new tab)</span></a>
            ))}</dd></div>
          </dl>
          <p className="fine-print">{SOURCE_NOTE} No opening hours or map are shown because none could be confirmed.</p>
        </section>

        <section className="contact__form" aria-labelledby="contact-form-title">
          <h2 id="contact-form-title" className="contact__form-title">Send a message <span className="concept-label">Demo</span></h2>
          <p className="concept-note"><strong>Demo only — your message will not be sent.</strong> This form never connects to email or WhatsApp.</p>
          <FormFlow flow={contactFlow} referencePrefix="DEMO" restartLabel="Write another message" />
        </section>
      </div>
    </>
  )
}

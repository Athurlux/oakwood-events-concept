import { Link } from 'react-router'
import { business } from '../data/business'
import { Wordmark } from './Brand'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <Wordmark className="wordmark--light" />
            <p>Event planning and management, styling and decoration, and fresh, garden-style florals, from Ntinda, Kampala.</p>
          </div>

          <div className="site-footer__col">
            <h2>Explore</h2>
            <ul>
              <li><Link to="/work">Our work</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/plan">Plan your event</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="site-footer__col">
            <h2>Oakwood Events Uganda</h2>
            <address>
              <p>{business.address}</p>
              <p><a href={`mailto:${business.email}`}>{business.email}</a></p>
              {business.phones.map(phone => <p key={phone.href}><a href={phone.href}>{phone.display}</a></p>)}
            </address>
            <p className="site-footer__note">As published on Oakwood’s own website. These links reach the real business, not this demo.</p>
          </div>
        </div>

        <div className="site-footer__disclosure" id="disclosure">
          <p><strong>Independent website concept.</strong> This is a redesign proposal by Arthur Kitandwe, not Oakwood Events Uganda’s official website, and it is not authorised by or affiliated with them.</p>
          <p>Every photograph on this site is an AI-generated illustrative concept, not Oakwood’s portfolio or floral work. The forms are demonstrations: nothing you enter is stored or sent.</p>
          <p className="site-footer__credit">Concept design and build: Arthur Kitandwe, 2026.</p>
        </div>
      </div>
    </footer>
  )
}

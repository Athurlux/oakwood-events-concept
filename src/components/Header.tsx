import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { useFocusTrap, useScrollLock } from '../lib/useFocusTrap'
import { Icon } from './Icon'
import { Wordmark } from './Brand'

export const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/work', label: 'Our work' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
]

/**
 * Over the home hero the bar is transparent with light text, and turns solid once the
 * page scrolls or the menu opens. Every other page gets the solid bar from the start.
 */
export function Header({ overlay }: { overlay: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useFocusTrap(barRef, menuOpen, closeMenu)
  useScrollLock(menuOpen)
  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    if (!overlay) return
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [overlay])

  const transparent = overlay && !scrolled && !menuOpen

  return (
    <header className={`site-header ${transparent ? 'is-transparent' : ''} ${overlay ? 'is-overlay' : ''} ${menuOpen ? 'is-menu' : ''}`}>
      <div ref={barRef}>
        <div className="container site-header__inner">
          <Link to="/" className="site-header__logo" aria-label="Oakwood Events Uganda concept, home">
            <Wordmark />
          </Link>

          <nav className="site-nav" aria-label="Main">
            <ul>
              {NAV.map(link => <li key={link.to}><NavLink to={link.to} end={link.end}>{link.label}</NavLink></li>)}
            </ul>
          </nav>

          <div className="site-header__actions">
            <Link to="/plan" className="button button--header">Plan your event</Link>
            <button type="button" className="menu-button" aria-expanded={menuOpen} aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(open => !open)}>
              <Icon name={menuOpen ? 'close' : 'menu'} size={22} />
            </button>
          </div>
        </div>

        <div id="mobile-menu" className="mobile-menu" hidden={!menuOpen}>
          <nav aria-label="Mobile">
            <ul className="mobile-menu__primary">
              {NAV.map((link, index) => (
                <li key={link.to}><NavLink to={link.to} end={link.end} data-autofocus={index === 0 ? '' : undefined}>{link.label}</NavLink></li>
              ))}
              <li><NavLink to="/plan">Plan your event</NavLink></li>
            </ul>
            <ul className="mobile-menu__secondary">
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/about#concept">About this concept</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

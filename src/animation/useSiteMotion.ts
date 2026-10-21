import type { RefObject } from 'react'
import { gsap, ScrollTrigger, useGSAP } from './gsap'

const DUR = { fast: 0.35, base: 0.6, slow: 0.9, hero: 1.6 }
const EASE = { out: 'power3.out', expo: 'expo.out', reveal: 'power2.inOut', settle: 'power2.out' }

const revealPending = () => document.documentElement.classList.remove('hero-pending')

/**
 * One scoped context per page. useGSAP reverts every tween and ScrollTrigger on unmount,
 * and matchMedia reverts per-breakpoint work on resize, so navigation and resizing cannot
 * pile triggers up. Content is visible by default: elements are hidden only inside the
 * motion branch, right before their reveal is armed, and links, buttons and form controls
 * are never made transparent. Nothing is pinned and nothing loops.
 */
export function useSiteMotion(root: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 900px)' }, context => {
      const { motion, desktop } = context.conditions as { motion: boolean; desktop: boolean }
      const scope = root.current
      // Reduced motion: the complete static composition, exactly as the CSS lays it out.
      if (!scope || !motion) { revealPending(); return }
      const cleanups: (() => void)[] = []

      // ---- Hero: the headline arrives in two stages while the photograph settles ----------
      if (scope.querySelector('[data-hero="line"]')) {
        const tl = gsap.timeline({ defaults: { ease: EASE.expo } })
        tl.from('[data-hero="photo"]', { scale: 1.03, duration: DUR.hero, ease: EASE.settle }, 0)
          // Kept short: the headline is the page's LCP element, so a long entrance delays it.
          .from('[data-hero="line"]', { yPercent: 100, duration: 0.85, stagger: 0.22 }, 0.05)
          .from('[data-hero="lede"]', { y: 10, opacity: 0, duration: DUR.base, ease: EASE.out }, '-=0.55')
          // The actions only move; they are never transparent, so they are usable at once.
          .from('[data-hero="actions"]', { y: 10, duration: DUR.base, ease: EASE.out }, '<')
        revealPending()
        // Reaching for a control mid-entrance finishes the entrance at once.
        const settle = () => tl.progress(1)
        scope.addEventListener('pointerdown', settle)
        scope.addEventListener('focusin', settle)
        cleanups.push(() => { scope.removeEventListener('pointerdown', settle); scope.removeEventListener('focusin', settle) })
      } else {
        revealPending()
      }

      // ---- Figures: a mask opens from the lower edge on desktop; a short fade on phones ----
      gsap.utils.toArray<HTMLElement>('[data-anim="scene"]', scope).forEach(frame => {
        const image = frame.querySelector('img')
        const tl = gsap.timeline({ scrollTrigger: { trigger: frame, start: 'top 88%', once: true } })
        if (desktop) {
          tl.fromTo(frame, { clipPath: 'inset(12% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: EASE.reveal, clearProps: 'clipPath' })
          if (image) tl.from(image, { scale: 1.04, duration: 1.4, ease: EASE.settle, clearProps: 'transform' }, 0)
        } else {
          tl.from(frame, { opacity: 0, duration: DUR.base, ease: EASE.out, clearProps: 'opacity' })
        }
      })

      // ---- Text groups: a modest stagger, batched into one trigger per screenful ---------
      const items = gsap.utils.toArray<HTMLElement>('[data-anim="rise"]', scope)
      if (items.length) {
        gsap.set(items, { y: desktop ? 18 : 10, opacity: 0 })
        ScrollTrigger.batch(items, {
          start: 'top 92%', once: true,
          onEnter: batch => gsap.to(batch, { y: 0, opacity: 1, duration: DUR.base, stagger: 0.08, ease: EASE.out, clearProps: 'transform,opacity' }),
        })
      }

      // ---- Floral corner: settles a few pixels into place once, then stays still -------
      gsap.utils.toArray<HTMLElement>('[data-anim="corner"]', scope).forEach(corner => {
        gsap.from(corner, { x: 16, y: 16, opacity: 0, duration: 1.4, ease: EASE.settle, scrollTrigger: { trigger: corner, start: 'top 90%', once: true } })
      })

      // Late fonts and lazy images shift layout; recalculate trigger positions once they land.
      let alive = true
      const refresh = () => { if (alive) ScrollTrigger.refresh() }
      document.fonts.ready.then(refresh)
      window.addEventListener('load', refresh, { once: true })
      return () => { alive = false; window.removeEventListener('load', refresh); cleanups.forEach(cleanup => cleanup()) }
    })

    return () => revealPending()
  }, { scope: root, dependencies: [] })
}

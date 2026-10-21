import wordmark from './wordmark.json'

/** The proposed concept wordmark, outlined from Cormorant Garamond and Manrope (scripts/make-brand.py). */
export function Wordmark({ className }: { className?: string }) {
  return (
    <svg className={`wordmark ${className ?? ''}`} viewBox={wordmark.viewBox} aria-hidden="true" focusable="false">
      <path className="wordmark__name" d={wordmark.name} />
      <path className="wordmark__sub" d={wordmark.sub} />
    </svg>
  )
}

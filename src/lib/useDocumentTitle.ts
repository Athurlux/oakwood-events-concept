import { useEffect } from 'react'

const SITE = 'Oakwood Events Uganda (independent concept)'
const DEFAULT_DESCRIPTION = 'An independent website redesign concept for Oakwood Events Uganda: event planning, styling and garden-style florals. Not the official website; images are illustrative and forms send nothing.'

export function useDocumentTitle(title: string | null, description = DEFAULT_DESCRIPTION) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE}` : `${SITE} · Beautifully considered`
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}

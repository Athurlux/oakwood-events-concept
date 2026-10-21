// Facts about Oakwood Events Uganda that the concept publishes. Every item here was read on
// Oakwood's own website (via Internet Archive captures from June–July 2025, because the live
// site returned a server error on 21 October 2026). Sources and omissions: docs/CONTENT-NOTES.md.

export const CHECKED = '21 October 2026'
export const SOURCE_NOTE = 'As published on oakwoodeventsuganda.com (Internet Archive capture, July 2025). The live site could not be loaded when this concept was checked on 21 October 2026.'

export const business = {
  name: 'Oakwood Events Uganda',
  since: 'July 2017',
  leads: [
    { name: 'Stella', role: 'Lead Event Planner & Creative Design', focus: 'Founded Oakwood; coordinates business development, floral and creative design. A trained economist, project planner and garden-style florist.' },
    { name: 'Charlotte', role: 'Lead Events Manager, Finance & Operations', focus: 'Coordinates the firm’s operations and financial management. A trained financial analyst and HR manager.' },
  ],
  address: 'Ntinda Business Village, 1st Floor, Bukenya Lane, Kampala',
  email: 'oakwoodeventsuganda@gmail.com',
  phones: [
    { display: '+256 701 234 858', href: 'tel:+256701234858' },
    { display: '+256 701 624 222', href: 'tel:+256701624222' },
  ],
  profiles: [
    { label: 'Instagram', handle: '@oakwoodeventsug', href: 'https://www.instagram.com/oakwoodeventsug/' },
    { label: 'Facebook', handle: 'oakwoodeventsuganda', href: 'https://www.facebook.com/oakwoodeventsuganda/' },
  ],
} as const

/** The meaning behind the name, as Oakwood tells it on its "Who we are" page (paraphrased). */
export const nameStory = {
  values: ['resilience', 'flexibility', 'longevity', 'premium value service'],
}

/**
 * The first steps of Oakwood's own published process. Later steps on this site are
 * proposed wording, and are labelled that way where they appear.
 */
export const publishedProcess = [
  'An enquiry form is the first step in learning about the event.',
  'The team replies to confirm availability for the date.',
  'A conversation about the event vision guides a preliminary quotation.',
]

/** Kinds of events Oakwood's own portfolio and service names have covered (no client names). */
export const documentedEventTypes = [
  'white weddings and receptions',
  'traditional ceremonies, including kuhingira and kukyala',
  'christenings and birthdays',
  'a corporate customer-engagement evening',
  'bridal bouquets and floral gifts',
]

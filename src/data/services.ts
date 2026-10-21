import type { ImageName } from '../components/Img'

// The three service names are Oakwood's own (their "Our services" page). The short
// descriptions and "an enquiry covers" lists are proposed copy, labelled as such on the
// page, for Oakwood to confirm or correct. Floral offerings are the item names from
// Oakwood's flower-shop pages.

export interface Service {
  id: 'planning' | 'styling' | 'florals'
  name: string
  summary: string
  covers: string[]
  /** Offerings named on Oakwood's own pages, shown as verified. */
  published?: string[]
  image: { name: ImageName; alt: string; caption: string }
}

export const SERVICES: Service[] = [
  {
    id: 'planning',
    name: 'Event planning & management',
    summary: 'For hosts who want one team holding the whole event together, from the first conversation to the close of the day.',
    covers: [
      'The occasion, its date and how settled it is',
      'Venue, whether chosen or still open',
      'Guest numbers and the shape of the day',
      'Which other suppliers are already in place',
      'A budget range to discuss, never a fixed price',
    ],
    image: { name: 'wedding-detail', alt: 'Concept crop: a white rose centrepiece, glassware and a candle on an ivory reception table.', caption: 'Illustrative concept image, not Oakwood’s work.' },
  },
  {
    id: 'styling',
    name: 'Event styling & decoration',
    summary: 'For the look and feel of the space: how tables, drapery, lighting and florals come together into one setting.',
    covers: [
      'The mood, colours and references you have in mind',
      'The venue and what it already brings',
      'Table layout, ceremony or stage areas',
      'Whether florals are part of the brief',
    ],
    image: { name: 'corporate-detail', alt: 'Concept crop: olive napkins, candles and glassware along a dinner table.', caption: 'Illustrative concept image, not Oakwood’s work.' },
  },
  {
    id: 'florals',
    name: 'Flowers by Oakwood',
    summary: 'Fresh, garden-style floral design: arrangements that feel gathered rather than formal, for events and beyond.',
    covers: [
      'The occasion and the pieces you need',
      'Colours and flowers you love, or would rather avoid',
      'Delivery date and place',
    ],
    published: [
      'Bridal bouquets',
      'Floral gift baskets',
      'Garden-style florals for home, office and hotel',
      'Weekly subscription florals',
    ],
    image: { name: 'floral', alt: 'Concept image: white garden roses, spray roses and white blossom with green leaves in a stone urn.', caption: 'Illustrative concept image, not Oakwood’s floral work.' },
  },
]

export const findService = (id: string | null) => SERVICES.find(service => service.id === id)

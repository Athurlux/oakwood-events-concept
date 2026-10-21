import type { ImageName } from '../components/Img'

// Four concept collections, one per kind of occasion. Each is built from a single
// AI-generated illustrative image and one labelled crop of that same image. None of them
// documents an Oakwood event, so there are no dates, venues, couples or guest counts.

export const CATEGORIES = [
  { id: 'weddings', label: 'Weddings', occasion: 'wedding', noun: 'wedding' },
  { id: 'traditional', label: 'Traditional celebrations', occasion: 'traditional', noun: 'traditional celebration' },
  { id: 'corporate', label: 'Corporate', occasion: 'corporate', noun: 'corporate event' },
  { id: 'private', label: 'Private occasions', occasion: 'private', noun: 'private occasion' },
] as const

export type CategoryId = (typeof CATEGORIES)[number]['id']

export interface Collection {
  slug: string
  category: CategoryId
  title: string
  /** One line for lists and the index. */
  line: string
  /** Short design narrative: what the concept proposes, not a story about a client. */
  narrative: string[]
  notes: { label: string; value: string }[]
  image: { name: ImageName; alt: string }
  detail: { name: ImageName; alt: string; caption: string }
}

export const COLLECTIONS: Collection[] = [
  {
    slug: 'garden-reception',
    category: 'weddings',
    title: 'Garden Reception',
    line: 'Ivory linen, garden roses and candlelight as the evening comes in.',
    narrative: [
      'A reception that lets the garden do half the work. Round tables in ivory linen sit close enough for conversation, with rattan-backed chairs that keep the setting light rather than formal.',
      'The florals stay low on the tables, garden roses, spray roses and soft greenery, so guests can see each other across them. Height comes from lanterns overhead and from the candles, which take over as the light goes.',
    ],
    notes: [
      { label: 'Palette', value: 'Ivory, cream and leaf green, with warm gold from candlelight' },
      { label: 'Florals', value: 'Low, loose garden-style centrepieces; roses with trailing greenery' },
      { label: 'Setting', value: 'Outdoor reception at dusk; lanterns and glass-held candles' },
    ],
    image: { name: 'wedding', alt: 'Concept image: round reception tables in ivory linen with white garden-rose centrepieces, rattan chairs and candles at dusk, a city and lake in the distance.' },
    detail: { name: 'wedding-detail', alt: 'Close crop of the same concept image: a white rose centrepiece, glassware and a candle on an ivory table.', caption: 'Detail crop of the same concept image.' },
  },
  {
    slug: 'courtyard-ceremony',
    category: 'traditional',
    title: 'Courtyard Ceremony',
    line: 'Draped canopies, clay vessels and warm florals for a long celebration.',
    narrative: [
      'Traditional ceremonies run for hours and gather large families, so this concept is built around comfort: shaded lounge areas under draped canopies, low seating with cushions in rust and terracotta, and woven pendant lights.',
      'The florals are fuller and warmer than a white wedding, peach and coral roses with palm and monstera, set in clay vessels on the ground so they frame the spaces without blocking anyone’s view.',
    ],
    notes: [
      { label: 'Palette', value: 'Cream drapery with terracotta, rust and peach' },
      { label: 'Florals', value: 'Generous arrangements in clay pots; roses with tropical leaves' },
      { label: 'Setting', value: 'Garden lounges under canopies, woven rugs and rattan pendants' },
    ],
    image: { name: 'traditional', alt: 'Concept image: garden lounge areas under cream draped canopies, with rattan sofas, terracotta cushions, woven rugs and floral arrangements in clay pots.' },
    detail: { name: 'traditional-detail', alt: 'Close crop of the same concept image: a floral arrangement of peach roses and palm leaves in clay pots beside a draped canopy pole.', caption: 'Detail crop of the same concept image.' },
  },
  {
    slug: 'evening-dinner',
    category: 'corporate',
    title: 'Evening Dinner',
    line: 'Olive linen, white florals and a long table that reads as one room.',
    narrative: [
      'A corporate dinner where the styling stays disciplined. Long tables in olive linen run the length of the room, with white chairs and repeated low arrangements so the table reads as one continuous line.',
      'Candles and small potted olive trees soften a hard, modern space. The stage stays clear and the sightlines open, because the evening still has a programme to run.',
    ],
    notes: [
      { label: 'Palette', value: 'Olive, white and brass' },
      { label: 'Florals', value: 'Repeated white hydrangea and rose arrangements, kept low' },
      { label: 'Setting', value: 'Indoor function room; long tables, candlelight, potted olive trees' },
    ],
    image: { name: 'corporate', alt: 'Concept image: long dinner tables in olive linen with white flowers and candles, white upholstered chairs and potted olive trees in a modern hall.' },
    detail: { name: 'corporate-detail', alt: 'Close crop of the same concept image: olive napkins on plates, candles and glassware along the table.', caption: 'Detail crop of the same concept image.' },
  },
  {
    slug: 'terrace-celebration',
    category: 'private',
    title: 'Terrace Celebration',
    line: 'Blush florals and candlelit tables for a smaller gathering.',
    narrative: [
      'A smaller occasion, a birthday, an anniversary or a family dinner, set on a terrace at sunset. A wall of blush and cream flowers gives the space one strong moment, and everything else stays simple.',
      'Round tables for a few guests each keep it intimate. Candles at different heights carry the warmth of the flowers through to the tables as the sky fades.',
    ],
    notes: [
      { label: 'Palette', value: 'Blush, cream and peach with warm candlelight' },
      { label: 'Florals', value: 'One full floral wall; small matching table arrangements' },
      { label: 'Setting', value: 'Terrace at sunset; small round tables, pillar candles' },
    ],
    image: { name: 'private', alt: 'Concept image: a terrace at sunset with a wall of blush and cream flowers, candles, and round tables set for a small dinner.' },
    detail: { name: 'private-detail', alt: 'Close crop of the same concept image: the blush floral wall with pillar candles at its base.', caption: 'Detail crop of the same concept image.' },
  },
]

export const categoryLabel = (id: CategoryId) => CATEGORIES.find(category => category.id === id)!.label
export const isCategory = (value: string | null): value is CategoryId => CATEGORIES.some(category => category.id === value)

/** Collections for a filter value; anything unrecognised shows everything. */
export function filterCollections(category: string | null) {
  return isCategory(category) ? COLLECTIONS.filter(collection => collection.category === category) : COLLECTIONS
}

export const findCollection = (slug: string | undefined) => COLLECTIONS.find(collection => collection.slug === slug)

export function nextCollection(slug: string) {
  const index = COLLECTIONS.findIndex(collection => collection.slug === slug)
  return COLLECTIONS[(index + 1) % COLLECTIONS.length]
}

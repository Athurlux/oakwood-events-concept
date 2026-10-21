import { eitherContact, type FlowSpec } from './engine'
import { addDays, futureDateError } from '../lib/validation'

// Both journeys are demonstrations: drafts live in React memory, nothing is stored or sent.

const MAX_DAYS_AHEAD = 365 * 3

export type PlanDraft = {
  occasion: string | null
  services: string | null
  dateMode: string | null
  date: string | null
  timing: string | null
  venueMode: string | null
  venue: string | null
  area: string | null
  guests: string | null
  name: string | null
  email: string | null
  phone: string | null
  contactPref: string | null
  budget: string | null
  notes: string | null
}

export const OCCASIONS = [
  { value: 'wedding', label: 'Wedding', description: 'Ceremony, reception or both' },
  { value: 'traditional', label: 'Traditional celebration', description: 'Introduction, kuhingira, kukyala or similar' },
  { value: 'corporate', label: 'Corporate event', description: 'Dinner, launch, client evening' },
  { value: 'private', label: 'Private occasion', description: 'Birthday, christening, anniversary' },
  { value: 'other', label: 'Something else' },
]

export const SERVICE_OPTIONS = [
  { value: 'planning', label: 'Planning & management' },
  { value: 'styling', label: 'Styling & decoration' },
  { value: 'florals', label: 'Floral design' },
  { value: 'unsure', label: 'Not sure yet' },
]

export const planFlow: FlowSpec<PlanDraft> = {
  key: 'plan',
  empty: () => ({
    occasion: null, services: null, dateMode: null, date: null, timing: null, venueMode: null, venue: null, area: null,
    guests: null, name: null, email: null, phone: null, contactPref: null, budget: null, notes: null,
  }),
  stages: [
    {
      id: 'occasion',
      title: 'Occasion and services',
      intro: 'Start with what you are celebrating and the kind of help you are looking for.',
      fields: [
        { name: 'occasion', label: 'Occasion', kind: 'radio', options: OCCASIONS, requiredMessage: 'Choose the kind of occasion.' },
        { name: 'services', label: 'Services you are interested in', kind: 'checkboxes', options: SERVICE_OPTIONS, hint: 'Choose any that apply.', requiredMessage: 'Choose at least one service, or “Not sure yet”.' },
      ],
    },
    {
      id: 'details',
      title: 'Date, venue and guests',
      intro: 'Undecided is a perfectly good answer at this stage.',
      fields: [
        {
          name: 'dateMode', label: 'Event date', kind: 'radio', requiredMessage: 'Choose how settled the date is.',
          options: [
            { value: 'exact', label: 'We have a date' },
            { value: 'flexible', label: 'Roughly, not fixed' },
            { value: 'undecided', label: 'Not decided yet' },
          ],
        },
        {
          name: 'date', label: 'Date', kind: 'date', when: draft => draft.dateMode === 'exact', hint: 'Checked against today’s date in Kampala.',
          dateBounds: today => ({ min: today, max: addDays(today, MAX_DAYS_AHEAD) }),
          validate: (value, _draft, now) => futureDateError(value ?? '', now, { maxDays: MAX_DAYS_AHEAD, label: 'a date' }),
        },
        { name: 'timing', label: 'Approximate timing', kind: 'text', when: draft => draft.dateMode === 'flexible', placeholder: 'For example, June or July 2027', maxLength: 60 },
        {
          name: 'venueMode', label: 'Venue', kind: 'radio', requiredMessage: 'Choose where you are with the venue.',
          options: [
            { value: 'chosen', label: 'Venue chosen' },
            { value: 'looking', label: 'Still looking' },
            { value: 'undecided', label: 'Not decided yet' },
          ],
        },
        { name: 'venue', label: 'Venue name', kind: 'text', when: draft => draft.venueMode === 'chosen', maxLength: 120 },
        { name: 'area', label: 'Town or area', kind: 'text', optional: true, placeholder: 'For example, Kampala or Entebbe', maxLength: 80 },
        {
          name: 'guests', label: 'Expected guests', kind: 'select', requiredMessage: 'Choose an approximate guest count.',
          options: [
            { value: 'under-50', label: 'Fewer than 50' },
            { value: '50-150', label: '50 to 150' },
            { value: '150-300', label: '150 to 300' },
            { value: '300-600', label: '300 to 600' },
            { value: 'over-600', label: 'More than 600' },
            { value: 'unsure', label: 'Not sure yet' },
          ],
        },
      ],
    },
    {
      id: 'contact',
      title: 'Contact and preferences',
      fields: [
        { name: 'name', label: 'Your name', kind: 'text', autoComplete: 'name', minLength: 2, maxLength: 80 },
        { name: 'email', label: 'Email', kind: 'email', optional: true, autoComplete: 'email', maxLength: 120, hint: 'For example, name@example.com.' },
        { name: 'phone', label: 'Phone', kind: 'tel', optional: true, autoComplete: 'tel', hint: 'Ugandan or international, for example 0772 123 456 or +44 7700 900123.', maxLength: 24 },
        {
          name: 'contactPref', label: 'Preferred way to reply', kind: 'radio', requiredMessage: 'Choose how you would prefer a reply.',
          options: [
            { value: 'email', label: 'Email' },
            { value: 'call', label: 'Phone call' },
            { value: 'whatsapp', label: 'WhatsApp message' },
          ],
        },
        {
          name: 'budget', label: 'Budget range', kind: 'select', hint: 'Only a starting point for a conversation. It is not a quote or a price.', requiredMessage: 'Choose a budget range, or “Prefer to discuss”.',
          options: [
            { value: 'discuss', label: 'Prefer to discuss' },
            { value: 'under-10', label: 'Under UGX 10 million' },
            { value: '10-25', label: 'UGX 10 to 25 million' },
            { value: '25-50', label: 'UGX 25 to 50 million' },
            { value: 'over-50', label: 'Over UGX 50 million' },
          ],
        },
        { name: 'notes', label: 'Anything else', kind: 'textarea', optional: true, rows: 5, maxLength: 1000, hint: 'Colours, references, family traditions or questions.' },
      ],
      validate: (draft) => {
        const errors = eitherContact('contact-details', 'email', 'phone')(draft)
        if (errors['contact-details']) return errors
        if (draft.contactPref === 'email' && !draft.email?.trim()) return { contactPref: 'Add an email address above, or choose a phone reply.' }
        if ((draft.contactPref === 'call' || draft.contactPref === 'whatsapp') && !draft.phone?.trim()) return { contactPref: 'Add a phone number above, or choose an email reply.' }
        return {}
      },
    },
  ],
  groups: [{ id: 'contact-details', legend: 'How to reach you', hint: 'Give an email address, a phone number or both.', fields: ['email', 'phone'] }],
  sample: today => ({
    occasion: 'wedding',
    services: 'styling|florals',
    dateMode: 'exact',
    date: addDays(today, 200),
    venueMode: 'chosen',
    venue: 'Sample Gardens (fictional)',
    area: 'Kampala',
    guests: '150-300',
    name: 'Sample Guest',
    email: 'sample.guest@example.com',
    phone: '+256 700 000 000',
    contactPref: 'email',
    budget: 'discuss',
    notes: 'Sample note: soft whites and greenery, an outdoor reception and low table flowers.',
  }),
  review: { title: 'Review your enquiry', intro: 'Check each answer. Use Edit to change a section; your other answers stay as they are.' },
  final: { label: 'Complete demo enquiry', note: 'Demo only — your enquiry will not be sent.' },
  done: {
    title: 'Your demo enquiry is complete',
    body: 'Nothing was sent to Oakwood Events Uganda or to anyone else. No date has been checked or held, and nobody will contact you because of this demo. To reach Oakwood, use the contact details published on the Contact page.',
  },
}

export type ContactDraft = {
  name: string | null
  email: string | null
  phone: string | null
  topic: string | null
  message: string | null
}

export const contactFlow: FlowSpec<ContactDraft> = {
  key: 'contact',
  empty: () => ({ name: null, email: null, phone: null, topic: null, message: null }),
  stages: [
    {
      id: 'message',
      title: 'Your message',
      fields: [
        { name: 'name', label: 'Your name', kind: 'text', autoComplete: 'name', minLength: 2, maxLength: 80 },
        { name: 'email', label: 'Email', kind: 'email', optional: true, autoComplete: 'email', maxLength: 120, hint: 'For example, name@example.com.' },
        { name: 'phone', label: 'Phone', kind: 'tel', optional: true, autoComplete: 'tel', hint: 'Ugandan or international format.', maxLength: 24 },
        {
          name: 'topic', label: 'Topic', kind: 'select', requiredMessage: 'Choose a topic.',
          options: [
            { value: 'event', label: 'A question about an event' },
            { value: 'flowers', label: 'Flowers or floral gifts' },
            { value: 'other', label: 'Something else' },
          ],
        },
        { name: 'message', label: 'Message', kind: 'textarea', rows: 6, minLength: 10, maxLength: 1000 },
      ],
      validate: eitherContact('contact-reach', 'email', 'phone'),
    },
  ],
  groups: [{ id: 'contact-reach', legend: 'How to reach you', hint: 'Give an email address, a phone number or both.', fields: ['email', 'phone'] }],
  sample: () => ({
    name: 'Sample Guest',
    email: 'sample.guest@example.com',
    topic: 'flowers',
    message: 'Sample message: do you make garden-style bouquets for a small family celebration?',
  }),
  review: { title: 'Review your message', intro: 'Check the details before completing the demo.' },
  final: { label: 'Complete demo message', note: 'Demo only — your message will not be sent.' },
  done: {
    title: 'Your demo message is complete',
    body: 'No message was sent to Oakwood Events Uganda or to anyone else, and nobody will reply because of this demo. Oakwood’s own published contact details are listed on this page.',
  },
}

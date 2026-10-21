import { describe, expect, it } from 'vitest'
import { addDays, futureDateError, kampalaToday, normalizePhone, emailError } from './validation'
import { createReference, firstIncompleteIndex, pruneHidden, reviewSections, validateStage } from '../forms/engine'
import { DONE, REVIEW, resolveStep } from '../forms/useFormFlow'
import { contactFlow, planFlow, type PlanDraft } from '../forms/flows'
import { COLLECTIONS, filterCollections, nextCollection } from '../data/collections'

// 21:30 UTC on 31 Dec is already 1 Jan in Kampala (UTC+3).
const LATE_NEW_YEARS_EVE = new Date('2026-12-31T21:30:00Z')
const today = kampalaToday()
const sample = (): PlanDraft => ({ ...planFlow.empty(), ...planFlow.sample(today) }) as PlanDraft
const stage = (id: string) => planFlow.stages.find(item => item.id === id)!

describe('Kampala dates', () => {
  it('uses the Kampala calendar day, not the visitor’s', () => {
    expect(kampalaToday(LATE_NEW_YEARS_EVE)).toBe('2027-01-01')
    expect(futureDateError('2026-12-31', LATE_NEW_YEARS_EVE)).toMatch(/today or a later date/)
    expect(futureDateError('2027-01-01', LATE_NEW_YEARS_EVE)).toBeNull()
  })
  it('rejects impossible and too-distant dates', () => {
    expect(futureDateError('2027-02-31', LATE_NEW_YEARS_EVE)).toBe('Enter a valid date.')
    expect(futureDateError(addDays('2027-01-01', 1096), LATE_NEW_YEARS_EVE, { maxDays: 1095 })).toMatch(/within the next 1095 days/)
  })
})

describe('contact formats', () => {
  it('accepts Ugandan and international phone numbers', () => {
    expect(normalizePhone('0772 123 456')).toBe('+256772123456')
    expect(normalizePhone('+256 (701) 234-858')).toBe('+256701234858')
    expect(normalizePhone('+44 7700 900123')).toBe('+447700900123')
    expect(normalizePhone('+256 12')).toBeNull()
    expect(normalizePhone('12345')).toBeNull()
  })
  it('accepts real-world email shapes', () => {
    expect(emailError('first.last+events@mail.co.ug', true)).toBeNull()
    expect(emailError('name@domain', true)).toMatch(/format/)
  })
})

describe('plan your event flow', () => {
  it('sample details pass every stage', () => {
    const draft = sample()
    for (const item of planFlow.stages) expect(validateStage(item, draft)).toEqual({})
  })
  it('requires a date only when the visitor has one, and a venue only when chosen', () => {
    const draft = { ...sample(), dateMode: 'exact', date: null, venueMode: 'chosen', venue: '' }
    expect(Object.keys(validateStage(stage('details'), draft)).sort()).toEqual(['date', 'venue'])
    const open = { ...draft, dateMode: 'undecided', venueMode: 'looking' }
    expect(validateStage(stage('details'), open)).toEqual({})
  })
  it('needs an email or phone, matching the preferred reply', () => {
    expect(validateStage(stage('contact'), { ...sample(), email: '', phone: '' })).toHaveProperty('contact-details')
    expect(validateStage(stage('contact'), { ...sample(), email: '', contactPref: 'email' })).toHaveProperty('contactPref')
    expect(validateStage(stage('contact'), { ...sample(), email: '', contactPref: 'whatsapp' })).toEqual({})
  })
  it('drops hidden answers before review', () => {
    const draft = { ...sample(), dateMode: 'undecided' }
    expect(pruneHidden(planFlow, draft).date).toBeNull()
    const dates = reviewSections(planFlow, draft).flatMap(section => section.entries).filter(entry => entry.name === 'date')
    expect(dates).toEqual([])
  })
})

describe('confirmation state', () => {
  it('a direct link cannot skip unfinished steps, but can ask for the done screen', () => {
    expect(resolveStep(planFlow, planFlow.empty(), REVIEW)).toBe('occasion')
    expect(resolveStep(planFlow, sample(), REVIEW)).toBe(REVIEW)
    expect(resolveStep(planFlow, planFlow.empty(), DONE)).toBe(DONE) // the page then shows its recovery message
    expect(firstIncompleteIndex(contactFlow, contactFlow.empty())).toBe(0)
  })
  it('references are DEMO-prefixed and unambiguous', () => {
    expect(createReference('DEMO')).toMatch(/^DEMO-[A-HJ-NP-Z2-9]{6}$/)
  })
})

describe('work filter', () => {
  it('filters by category and falls back to everything', () => {
    expect(filterCollections('weddings').map(item => item.slug)).toEqual(['garden-reception'])
    expect(filterCollections('corporate')).toHaveLength(1)
    expect(filterCollections(null)).toHaveLength(4)
    expect(filterCollections('bogus')).toHaveLength(4)
  })
  it('next collection cycles through all four', () => {
    const seen = new Set<string>()
    let slug = COLLECTIONS[0].slug
    for (let i = 0; i < 4; i++) { seen.add(slug); slug = nextCollection(slug).slug }
    expect(seen.size).toBe(4)
    expect(slug).toBe(COLLECTIONS[0].slug)
  })
})

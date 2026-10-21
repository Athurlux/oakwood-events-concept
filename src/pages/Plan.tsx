import { useSearchParams } from 'react-router'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { PageIntro } from '../components/Bits'
import { FormFlow } from '../forms/FormFlow'
import { OCCASIONS, planFlow, SERVICE_OPTIONS, type PlanDraft } from '../forms/flows'

/**
 * The guided enquiry. A collection or service page can pass ?occasion= or ?service= to
 * preselect a choice; those are the only values ever placed in the URL, never personal details.
 */
export default function Plan() {
  const [params] = useSearchParams()
  const occasion = params.get('occasion')
  const service = params.get('service')
  const prefill: Partial<PlanDraft> = {
    occasion: OCCASIONS.some(option => option.value === occasion) ? occasion : null,
    services: SERVICE_OPTIONS.some(option => option.value === service) ? service : null,
  }
  useDocumentTitle('Plan your event')

  return (
    <>
      <PageIntro title="Plan your event">
        <p>Four short steps: the occasion, the date and venue if you know them, how to reach you, and a final review.</p>
        <p className="concept-note"><strong>Demo only — your enquiry will not be sent.</strong> Answers stay in this browser tab, aren’t saved, and disappear on refresh.</p>
      </PageIntro>
      <div className="container section section--top-tight">
        <FormFlow flow={planFlow} referencePrefix="DEMO" prefill={prefill} restartLabel="Start a new enquiry"
          doneLinks={[{ label: 'Back to the homepage', to: '/' }]} />
      </div>
    </>
  )
}

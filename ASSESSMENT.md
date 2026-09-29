# Relay AI — Week 2 technical assessment

## Scope and setup

Fork: https://github.com/antunishdPursuit/l2assessment

Upstream baseline: `011d920`. Work branch: `fix/triage-priority`.

This assessment focuses on helping a small support team find urgent customer
issues and choose a useful next step. The user chose offline testing for now.
No Groq key was configured and no live model requests were made.

Readiness: ready for offline improvements. The existing UI, data shape, and
business brief are sufficient. Live AI evaluation is deferred until credentials
are available. A database, new design system, deployment, and automatic ticket
assignment are outside this change. Only synthetic messages were tested.

## Top three improvements

### 1. Prioritize business impact instead of writing style — implemented

Baseline rule execution returned Low for `Server down now`,
`Database connection lost`, and
`Please help, our production server is down. Thank you.`
It returned High for `I love the new design!!! Everything looks wonderful!!!`.

The scorer used punctuation, message length, capitalization, politeness, and the
local clock. These signals can put praise ahead of service failures.

Replace them with explicit outage, security, payment-interruption, and widespread
lockout signals. Recognized problems receive Medium priority; routine feedback
and requests receive Low. Unclear input receives Medium and asks for details.
Explain the priority in the UI. This is the selected primary improvement because
missed outages can affect many customers and revenue at once. The benefit is a
hypothesis; this assessment does not measure response time or retention.

### 2. Make recommendations match the issue and urgency — implemented

Baseline `getRecommendedAction('Feature Request', 'Low')` returned
`Ask user to check billing portal.` Urgency was unused, and the analysis page did
not pass it to the template function. Escalation depended on message length.

Feature requests now go to product; billing and technical issues have relevant
next steps. High priority takes precedence and asks the support lead to confirm
impact and category before routing. The escalation helper uses priority or an
unknown category. These are recommendations, not actual ticket assignments.

### 3. Make classification trustworthy and failures visible — partially addressed

Source inspection found an unrestricted prompt, category selection by searching
the entire model response for words, and silent keyword fallback presented as AI
reasoning. Browser testing without a key showed a blank page: Groq construction
failed during module import, before the fallback could run.

The app now starts without a key. Missing-key and API-error fallback results carry
an offline source label, visible in results, copied results, and expanded history.
Older history without source metadata is identified as such.

Next: move credentials and API calls to a backend, define and validate a structured
category schema, distinguish customer text from instructions, and evaluate mixed
billing/technical cases with a labeled dataset. Live classification remains
unverified. The original keyword fallback and random explanation variants remain.

## Validation

- Baseline: production build passed; lint reported six errors.
- Updated: `npm run lint` and `npm run build` pass.
- Updated: 29 Node tests cover outage detection, tone, unclear input, selected
  negated/resolved/hypothetical reports, clock independence, and recommendations.
- Small state-initialization fixes on Home, History, and Dashboard resolve the
  inherited React lint errors without changing their displayed calculations.
- Browser checks used new examples, not just the baseline messages:

| New message | Observed priority | Observed recommendation |
| --- | --- | --- |
| Our checkout is unavailable. Please help us restore access. | High | Immediate support-lead escalation |
| Thanks for the excellent training!!! We love the product!!! | Low | Customer-support response |
| Could you add scheduled weekly exports for our reports? | Low | Product-team feedback |
| Our invoice has a duplicate charge. Please investigate. | Medium | Billing investigation |

All four results displayed the offline warning and appeared in history. History
persisted after reload; the dashboard showed 4 messages, with 1 High, 1 Medium,
and 2 Low. A final polite production-outage check also returned High with the
category-verification escalation recommendation.
The checkout message was miscategorized as General Inquiry by the existing
fallback. High-priority escalation therefore requires category verification.

## Limits and next checks

The rules cover a bounded set of English phrases. They are not a general language
understanding system. Complex negation, past incidents, unfamiliar wording,
and mixed clauses can still produce wrong priorities. Human review is required;
do not treat the passing examples as a measured accuracy rate.

The app still stores messages in browser localStorage. Live mode still exposes
its API key in the browser and should not be deployed as a production service.
The initial dependency install reported 18 advisories (2 low, 3 moderate, 13 high);
dependency upgrades were not bundled into this triage change. Dashboard daily
averages and alphabetical history ordering remain as upstream implemented them.

Before calling the full assessment's AI testing complete, configure credentials
locally and run new messages through the live provider, including mixed issues,
invalid responses, timeouts, and prompt-injection attempts.

import test from 'node:test'
import assert from 'node:assert/strict'
import { assessUrgency, calculateUrgency } from '../src/utils/urgencyScorer.js'
import { getRecommendedAction, shouldEscalate } from '../src/utils/templates.js'

const cases = [
  ['short outage', 'Server down now', 'High'],
  ['database failure', 'Database connection lost', 'High'],
  ['polite outage', 'Please help, our production server is down. Thank you.', 'High'],
  ['uppercase outage', 'OUR WEBSITE IS DOWN', 'High'],
  ['question about current outage', 'Our checkout is down, can you help?', 'High'],
  ['payment interruption', 'We cannot process payments', 'High'],
  ['widespread lockout', 'All customers are locked out', 'High'],
  ['security incident', 'We found a data breach', 'High'],
  ['positive punctuation', 'I love the new design!!! Everything looks wonderful!!!', 'Low'],
  ['feature request', 'Could you add CSV export?', 'Low'],
  ['routine question', 'What are your business hours?', 'Low'],
  ['billing problem', 'You charged me twice. Please refund one payment.', 'Medium'],
  ['individual technical issue', "My dashboard won't load", 'Medium'],
  ['ambiguous input', 'hi', 'Medium'],
  ['unknown impact', 'Something strange happened with my account', 'Medium'],
  ['negated outage', 'There is no outage. What are your hours?', 'Low'],
  ['hypothetical incident', 'What if our server is down?', 'Low'],
  ['resolved incident', 'The outage is resolved, thank you', 'Low'],
  ['new incident after resolution', 'The outage is resolved, but our database is down', 'High'],
  ['thanks does not hide issue', 'Thanks, but my payment failed', 'Medium'],
  ['unresolved outage', 'The outage is not fixed', 'High'],
  ['mixed incidents', 'The outage is resolved and our database is down', 'High'],
  ['negation does not hide another incident', 'No data loss, but our server is down', 'High'],
  ['curly apostrophe', 'We can’t process payments', 'High'],
]
for (const [name, message, expected] of cases) {
  test(name, () => {
    assert.equal(calculateUrgency(message), expected)
    assert.ok(assessUrgency(message).reason.length > 0)
  })
}

test('tone and politeness do not lower an outage priority', () => {
  for (const message of ['Server down now', 'SERVER DOWN NOW', 'Server down now!!!', 'Please, server down now. Thanks!']) {
    assert.equal(calculateUrgency(message), 'High')
  }
})

test('priority does not depend on local time', () => {
  const OriginalDate = globalThis.Date
  try {
    globalThis.Date = class { constructor() { throw new Error('Must not read the clock') } }
    assert.equal(calculateUrgency('Our server is down'), 'High')
  } finally { globalThis.Date = OriginalDate }
})

test('high priority produces an escalation recommendation for every category', () => {
  for (const category of ['Billing Issue', 'Technical Problem', 'General Inquiry', 'Feature Request', 'Unknown']) {
    assert.match(getRecommendedAction(category, 'High'), /Escalate to the support lead immediately/)
    assert.equal(shouldEscalate(category, 'High'), true)
  }
})

test('feature requests go to product, not billing', () => {
  const action = getRecommendedAction('Feature Request', 'Low')
  assert.match(action, /product team/)
  assert.doesNotMatch(action, /billing/)
  assert.equal(shouldEscalate('Feature Request', 'Low'), false)
})

test('unknown categories require manual review', () => {
  assert.match(getRecommendedAction('unrecognized', 'Medium'), /Review manually/)
  assert.equal(shouldEscalate('Unknown', 'Medium'), true)
})

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { calculateUrgency } from '../src/utils/urgencyScorer.js'
import { getRecommendedAction } from '../src/utils/templates.js'

const cases = [
  ['Database connection lost', 'High', 'Technical Problem'],
  ['Our production API is unavailable.', 'High', 'General Inquiry'],
  ['Nobody in our office can log in.', 'High', 'Unknown'],
  ['All transactions are failing.', 'High', 'Billing Issue'],
  ['The production database is not down.', 'Low', 'Technical Problem'],
  ['The server will be down for maintenance next week.', 'Low', 'General Inquiry'],
  ['The dashboard times out on my laptop.', 'Medium', 'Technical Problem'],
  ['Where can I download my invoice?', 'Low', 'Billing Issue'],
  ['Great job!!! Love the update!!!', 'Low', 'General Inquiry'],
]

for (const [message, expectedUrgency, category] of cases) {
  test(message, () => {
    const urgency = calculateUrgency(message)
    assert.equal(urgency, expectedUrgency)
    const action = getRecommendedAction(category, urgency)
    assert.equal(action.startsWith('Escalate'), expectedUrgency === 'High')
  })
}

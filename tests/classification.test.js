import test from 'node:test'
import assert from 'node:assert/strict'
import { parseClassification } from '../src/utils/classification.js'

test('uses category field even when explanation mentions billing', () => {
  assert.deepEqual(parseClassification(JSON.stringify({category:'Technical Problem',reasoning:'An outage, not a billing issue.'})), {category:'Technical Problem',reasoning:'An outage, not a billing issue.'})
})
for (const [label, content] of [
  ['invalid JSON', 'Category: Technical Problem'],
  ['unknown category', '{"category":"Critical Incident","reasoning":"Outage"}'],
  ['missing explanation', '{"category":"Billing Issue"}'],
  ['empty explanation', '{"category":"Billing Issue","reasoning":" "}'],
  ['null response', 'null'],
]) {
  test(`rejects ${label}`, () => assert.throws(() => parseClassification(content)))
}

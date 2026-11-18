/**
 * Flag common signs of an active outage before routine technical symptoms.
 * Keep the rules independent of message length, punctuation, and local time.
 */
const outageSignals = [
  /\b(?:server|checkout|payment system|production (?:api|database|system|site|service|app)|site|website)\s+(?:(?:is|are)\s+(?:currently\s+)?)?(?:down|offline|unavailable)\b/i,
  /\bdatabase connection (?:is )?lost\b/i,
  /\b(?:no one|nobody)\b[^.!?\n]{0,50}\bcan\s+(?:sign in|log in|check out|place an order|access\b)/i,
  /\b(?:everyone|(?:all|every) (?:users?|customers?|orders?|transactions?))\b[^.!?\n]{0,50}\b(?:can['’]t|cannot|unable to|(?:is|are) failing|(?:has|have) failed)\b/i,
]

const technicalSymptoms =
  /\b(?:can['’]t|cannot|unable to)\s+(?:sign in|log in|load|access|check out)\b|\b(?:times? out|timed out|timing out|crash(?:es|ed|ing)?|not working|won['’]t load)\b/i

export function calculateUrgency(message) {
  if (outageSignals.some(signal => signal.test(message))) return 'High'
  if (technicalSymptoms.test(message)) return 'Medium'
  return 'Low'
}

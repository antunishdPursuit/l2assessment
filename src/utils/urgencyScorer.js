/**
 * Conservative English-language rules for a first-pass priority suggestion.
 * Tone, punctuation, message length and the local clock never change priority.
 * Unrecognized messages need review; these rules are not a severity guarantee.
 */
const criticalSignals = [
  /\b(?:server|service|site|website|production|database|api|checkout)\s+(?:(?:is|are|has gone)\s+)?(?:down|offline|unavailable)\b/i,
  /\b(?:database|db) connection (?:lost|failed)\b/i,
  /\b(?:outage|data breach|security breach|ransomware|data loss)\b/i,
  /\b(?:cannot|can't|unable to) (?:process|accept) (?:payments|orders)\b/i,
  /\b(?:all|every) (?:users?|customers?) (?:are |is )?(?:blocked|locked out|unable to|cannot|can't)\b/i,
]

const problemSignals = /\b(?:error|bug|broken|crash|crashes|failed|failing|slow|refund|charged|charge|invoice|payment|billing|cancel|cannot|can't|unable|not working|won't load|will not load|timing out)\b/i
const routineSignals = /\b(?:thank you|thanks|love|great|excellent|wonderful|feature|suggestion|would like|could you add|what|how|when|where|can i|is there|business hours)\b/i

export function assessUrgency(message) {
  // Keep separate clauses separate so a resolved issue cannot hide a new outage.
  const clauses = message.toLowerCase().replaceAll('’', "'")
    .split(/[,.!?;\n]+|\b(?:and|but|however)\b/)
  const activeClauses = clauses.filter(clause => !(
    /\b(?:no|not|without)\s+(?:an?\s+)?(?:outage|data breach|security breach|ransomware|data loss)\b/.test(clause) ||
    /\b(?:outage|incident|issue|problem) (?:is |was |has been )?(?:resolved|fixed)\b|\b(?:server|service|website|database) (?:is |was )?(?:restored|back online|no longer down)\b/.test(clause) ||
    /\b(?:what if|in case|if the|if our|how (?:do|can|should) (?:we|i))\b/.test(clause)
  ))

  if (activeClauses.some(clause => criticalSignals.some(signal => signal.test(clause)))) {
    return { urgency: 'High', reason: 'Possible outage, security incident, data loss, or widespread business interruption. Confirm impact immediately.' }
  }
  if (activeClauses.some(clause => problemSignals.test(clause))) {
    return { urgency: 'Medium', reason: 'A customer problem needs investigation; no configured critical signal was found.' }
  }
  if (routineSignals.test(message) || activeClauses.length < clauses.length) {
    return { urgency: 'Low', reason: 'Appears to be a routine request, feedback, or resolved incident. Confirm there is no ongoing impact.' }
  }
  return { urgency: 'Medium', reason: 'Impact is unclear. Ask for details before lowering priority.' }
}

export function calculateUrgency(message) {
  return assessUrgency(message).urgency
}

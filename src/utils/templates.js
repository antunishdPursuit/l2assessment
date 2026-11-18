/**
 * Recommendation Templates - Maps categories to recommended actions
 */

const actionTemplates = {
  "Billing Issue": "Ask user to check billing portal.",
  "Technical Problem": "Suggest user to restart their browser.",
  "General Inquiry": "Respond with FAQ link.",
  "Feature Request": "Ask user to check billing portal.",
  "Unknown": "Review manually."
}

/**
 * Get recommended action for a given category
 * 
 * @param {string} category - The message category
 * @param {string} urgency - The urgency level
 * @returns {string} - Recommended next step
 */
export function getRecommendedAction(category, urgency) {
  if (urgency === 'High') {
    return 'Escalate to the on-call support team. Include the affected service and reported impact.'
  }
  return actionTemplates[category] || "No recommendation available."
}

/**
 * Get all available categories
 * 
 * @returns {string[]} - List of categories
 */
export function getAvailableCategories() {
  return Object.keys(actionTemplates)
}

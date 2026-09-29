/** Suggested next steps only: this app does not send or assign tickets. */
const actionTemplates = {
  'Billing Issue': 'Route to billing support to investigate the charge, payment, or subscription issue.',
  'Technical Problem': 'Route to technical support. Collect the error, affected workflow, and steps to reproduce.',
  'General Inquiry': 'Route to customer support for an answer or a relevant help article.',
  'Feature Request': 'Log the request for the product team and acknowledge the customer’s feedback.',
  'Unknown': 'Review manually and ask for details before choosing a team.',
}

export function getRecommendedAction(category, urgency) {
  if (urgency === 'High') {
    return 'Escalate to the support lead immediately to confirm impact and coordinate the responsible team. Verify the category before routing.'
  }
  return actionTemplates[category] || actionTemplates.Unknown
}

export function getAvailableCategories() {
  return Object.keys(actionTemplates)
}

export function shouldEscalate(category, urgency) {
  return urgency === 'High' || category === 'Unknown'
}

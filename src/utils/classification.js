import { getAvailableCategories } from './templates.js'

export const classificationFormat = {
  type: 'json_schema',
  json_schema: {
    name: 'support_classification',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        category: { type: 'string', enum: getAvailableCategories() },
        reasoning: { type: 'string' },
      },
      required: ['category', 'reasoning'],
      additionalProperties: false,
    },
  },
}

export function parseClassification(content) {
  const result = JSON.parse(content)
  if (!result || !getAvailableCategories().includes(result.category) ||
      typeof result.reasoning !== 'string' || !result.reasoning.trim()) {
    throw new Error('Invalid classification response')
  }
  return { category: result.category, reasoning: result.reasoning.trim() }
}

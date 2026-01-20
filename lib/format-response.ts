/**
 * Formats API responses that contain raw data structures into readable text
 */
export function formatResponse(content: string): string {
  // Handle empty, null, or whitespace-only content
  if (!content || !content.trim()) {
    return "I don't have information about that. Please try asking a different question."
  }

  // Check if content contains source prefix like "[Source: ...]"
  const sourceMatch = content.match(/^\[Source:\s*([^\]]+)\]\s*/i)
  let source = ""
  let mainContent = content

  if (sourceMatch) {
    source = sourceMatch[1]
    mainContent = content.slice(sourceMatch[0].length)
  }

  // Handle empty content after source extraction
  if (!mainContent.trim()) {
    return source
      ? `**Source:** ${source}\n\nNo data available for this query.`
      : "I don't have information about that. Please try asking a different question."
  }

  // Try to parse as JSON-like structure
  let formattedContent = mainContent

  // Replace Python-style quotes with JSON quotes for parsing
  const jsonLikeContent = mainContent
    .replace(/'/g, '"')
    .replace(/None/g, "null")
    .replace(/True/g, "true")
    .replace(/False/g, "false")

  // Try to find and format data structures
  try {
    // Check if the entire content (after source) is a data structure
    if (
      jsonLikeContent.trim().startsWith("{") ||
      jsonLikeContent.trim().startsWith("[")
    ) {
      const parsed = JSON.parse(jsonLikeContent.trim())
      formattedContent = formatDataStructure(parsed)
    } else {
      // Try to find embedded data structures in text
      formattedContent = mainContent.replace(
        /(\{[^{}]*\}|\[[^\[\]]*\{[^{}]*\}[^\[\]]*\])/g,
        (match) => {
          try {
            const jsonMatch = match
              .replace(/'/g, '"')
              .replace(/None/g, "null")
              .replace(/True/g, "true")
              .replace(/False/g, "false")
            const parsed = JSON.parse(jsonMatch)
            return "\n" + formatDataStructure(parsed)
          } catch {
            return match
          }
        }
      )
    }
  } catch {
    // If parsing fails, return original content as-is
    formattedContent = mainContent
  }

  // Final check for empty formatted content
  if (!formattedContent.trim()) {
    formattedContent = "No data available for this query."
  }

  // Add source back if present
  if (source) {
    return `**Source:** ${source}\n\n${formattedContent}`
  }

  return formattedContent
}

function formatDataStructure(data: unknown): string {
  if (Array.isArray(data)) {
    if (data.length === 0) return "_No data available_"

    // Check if it's an array of objects
    if (typeof data[0] === "object" && data[0] !== null) {
      return data.map((item, index) => formatObject(item, index + 1)).join("\n\n")
    }

    // Simple array
    return data.map((item) => `- ${item}`).join("\n")
  }

  if (typeof data === "object" && data !== null) {
    return formatObject(data)
  }

  return String(data)
}

function formatObject(obj: unknown, index?: number): string {
  if (typeof obj !== "object" || obj === null) {
    return String(obj)
  }

  const entries = Object.entries(obj as Record<string, unknown>)
  const header = index ? `**Record ${index}:**\n` : ""

  const formatted = entries
    .map(([key, value]) => {
      const formattedKey = key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())

      let formattedValue: string
      if (value === null || value === undefined) {
        formattedValue = "_N/A_"
      } else if (typeof value === "object") {
        formattedValue = JSON.stringify(value)
      } else {
        formattedValue = String(value)
      }

      return `- **${formattedKey}:** ${formattedValue}`
    })
    .join("\n")

  return header + formatted
}

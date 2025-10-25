// Utility functions to decode HTML entities and unescape common escaped sequences

/**
 * Decode HTML entities like &lt;, &gt;, &#39;, &quot;, &amp;
 * Works in browser environment
 */
export function decodeHtmlEntities(input) {
  if (input == null) return ''
  const str = String(input)
  
  // Use DOMParser when available (browser)
  try {
    if (typeof DOMParser !== 'undefined') {
      const doc = new DOMParser().parseFromString(str, 'text/html')
      return doc.documentElement.textContent || ''
    }
  } catch (e) {
    // ignore and fallback
  }

  // Fallback to textarea method
  try {
    const txt = document.createElement('textarea')
    txt.innerHTML = str
    return txt.value
  } catch (e) {
    // If both fail, do manual replacement
    return str
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, '/')
      .replace(/&nbsp;/g, ' ')
  }
}

/**
 * Unescape common escaped sequences like \n, \t, \\
 */
export function unescapeSequences(input) {
  if (input == null) return ''
  return String(input)
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // replace literal backslash-n ("\\n") with an actual newline
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\r/g, '\r')
    // replace double backslash with single backslash (but do this last)
    .replace(/\\\\/g, '\\')
}

/**
 * Main formatting function that decodes HTML entities and unescapes sequences
 */
export function formatMessageText(input) {
  if (input == null) return ''
  // First decode HTML entities (e.g. &lt; &gt; &#39;)
  let s = decodeHtmlEntities(input)
  // Then unescape common escaped sequences (e.g. "\\n" -> actual newline)
  s = unescapeSequences(s)
  return s
}

export default formatMessageText

/**
 * Sanitize a decoded/unescaped message string into plain, human-readable text.
 * - Preserves fenced code blocks (```...```)
 * - Removes Markdown emphasis (**, __, *, _), inline code ticks, links and images
 * - Strips simple HTML tags and horizontal rules, normalizes whitespace
 */
export function sanitizeMarkdownToText(input) {
  if (input == null) return ''
  let s = String(input)

  // Extract fenced code blocks and replace with placeholders so we don't alter them
  const codeBlocks = []
  s = s.replace(/```[\s\S]*?```/g, (m) => {
    const idx = codeBlocks.length
    codeBlocks.push(m)
    return `__CODEBLOCK_${idx}__`
  })

  // Remove images: ![alt](url) -> alt
  s = s.replace(/!\[([^\]]*)\]\([^\)]*\)/g, '$1')
  // Convert links: [text](url) -> text
  s = s.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
  // Remove heading markers at start of line: # Header -> Header
  s = s.replace(/^\s{0,3}#{1,6}\s+/gm, '')
  // Remove thematic break lines (---, ***, ___)
  s = s.replace(/^([-*_]){3,}\s*$/gm, '')

  // Remove bold/strong markers **text** or __text__
  s = s.replace(/(\*\*|__)(.*?)\1/g, '$2')
  // Remove emphasis *text* or _text_
  s = s.replace(/(\*|_)(.*?)\1/g, '$2')
  // Remove inline code ticks `code` -> code
  s = s.replace(/`([^`]+)`/g, '$1')

  // Unescape common backslash escapes like \* \_ \` \[ \\\]
  s = s.replace(/\\([*_`\[\]\\])/g, '$1')

  // Strip simple HTML tags if any remain
  s = s.replace(/<[^>]+>/g, '')

  // Collapse multiple blank lines to at most one empty line (two newlines)
  s = s.replace(/\n{3,}/g, '\n\n')

  // Trim whitespace
  s = s.trim()

  // Restore code blocks placeholders back to original content
  if (codeBlocks.length > 0) {
    for (let i = 0; i < codeBlocks.length; i++) {
      s = s.replace(new RegExp(`__CODEBLOCK_${i}__`, 'g'), codeBlocks[i])
    }
  }

  return s
}

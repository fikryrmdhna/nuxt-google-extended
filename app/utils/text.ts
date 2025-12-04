export function displayedSplitDoubleStrip(text: string) {
  let parts: any = []
  if (text.includes('--')) {
    parts = text.split('--')
  }
  return parts.length > 1 ? parts[1].trim() : ''
}
export function displayedSplitStrip(text: string) {
  const parts = text.split('-')
  return parts.length > 1 ? parts.slice(1).join('-').trim() : text
}

export function changeToPascalCase(text: string) {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function splitLastSlug(url: string) {
  const result = url.split('/').pop()
  return result
}

export function articleContentFormatter(html: string, isAccessibleForFree: boolean): string {
  // 1. Regular expression to match <p> tags and its content
  const paragraphRegex = /<p\b[^>]*>.*?<\/p>/gi

  // 2. Extract all paragraphs
  const paragraphs: string[] = []
  let match = paragraphRegex.exec(html)

  while (match !== null) {
    // Strip out the <p> and </p> tags to get only the text content
    const plainText = match[0].replace(/(<([^>]+)>)/g, '')
    paragraphs.push(plainText) // push the plain text
    match = paragraphRegex.exec(html) // update match for the next iteration
  }

  // 3. If isAccessibleForFree is true, return all paragraphs as plain text.
  if (isAccessibleForFree) {
    return paragraphs.join('\n') // join all paragraphs together with newlines
  }
  else {
    return paragraphs.length > 0 ? paragraphs[0] : '' // return only the first paragraph as plain text
  }
}

export function normalizeTitle(str?: string): string {
  return (str || '').replace(/\s+/g, ' ').trim()
}

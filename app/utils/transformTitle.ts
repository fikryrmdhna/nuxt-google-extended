export function getTransformTitle(name: string = '') {
  const regex = /^[\p{L}\s]+/gu

  let cleanNames = ''
  if (name) {
    cleanNames = name.match(regex)?.[0].trim().replace(/\s+/g, '-').toLowerCase() || ''
  }
  return cleanNames
}

export function generateSlug(str: string | null) {
  if (!str) return str
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function capitalizeFirstLetter(str: string | undefined) {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function generateTitle(str: string) {
  return str
    .replace(/-/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}

export function generateTransform(str: string) {
  return str.replace(/\s+/g, '').replace(/-/g, '').toLowerCase()
}

// rule for chars, number, dash(symbol) only
export function validateUri(str: string) {
  const regex = /^[a-z0-9\-]+$/i
  return regex.test(str)
}

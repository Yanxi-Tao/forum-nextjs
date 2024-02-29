const SUPPORTED_URL_PROTOCOLS = new Set([
  'http:',
  'https:',
  'mailto:',
  'sms:',
  'tel:',
])

export function sanitizeUrl(url) {
  try {
    const parsedUrl = new URL(url)
    // eslint-disable-next-line no-script-url
    if (!SUPPORTED_URL_PROTOCOLS.has(parsedUrl.protocol)) {
      return 'about:blank'
    }
  } catch (_unused) {
    return url
  }
  return url
}

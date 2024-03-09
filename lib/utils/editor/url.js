const SUPPORTED_URL_PROTOCOLS = new Set([
  'http:',
  'https:',
  'mailto:',
  'sms:',
  'tel:',
])

export function sanitizeUrl(url) {
  if (!httpPrefix.test(url)) {
    url = `http://${url}`
  }

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

const urlRegExp = new RegExp(
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/
)

const httpPrefix = new RegExp('^https?://')

export function validateUrl(url) {
  // TODO Fix UI for link insertion; it should never default to an invalid URL such as https://.
  // Maybe show a dialog where they user can type the URL before inserting it.

  return urlRegExp.test(url)
}

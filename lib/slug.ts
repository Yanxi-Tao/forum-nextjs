import { slugifyWithCounter } from '@sindresorhus/slugify'

declare global {
  var slugifyInstance: ReturnType<typeof slugifyWithCounter> | undefined
}

export const slugify = globalThis.slugifyInstance || slugifyWithCounter()

if (process.env.NODE_ENV === 'development') {
  globalThis.slugifyInstance = slugify
}

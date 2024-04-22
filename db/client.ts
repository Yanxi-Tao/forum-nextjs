import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

// // In the db/client.ts file, we are creating a new PrismaClient instance and exporting
// // it as db. We also check if the globalThis object has a prisma property,
// // and if it does, we assign the PrismaClient instance to it.
// // This is useful for hot-reloading in development,
// // as it allows us to keep the same PrismaClient instance across multiple requests.

export const db = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV === 'development') {
  globalThis.prisma = db
}

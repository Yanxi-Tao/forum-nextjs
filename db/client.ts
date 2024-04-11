import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const createAcceleratedPrismaClient = () => {
  return new PrismaClient().$extends(withAccelerate())
}

// Define a type for the accelerated client.
type PrismaClientAccelerated = ReturnType<typeof createAcceleratedPrismaClient>

declare global {
  var prisma: PrismaClientAccelerated | undefined
}

// In the db/client.ts file, we are creating a new PrismaClient instance and exporting
// it as db. We also check if the globalThis object has a prisma property,
// and if it does, we assign the PrismaClient instance to it.
// This is useful for hot-reloading in development,
// as it allows us to keep the same PrismaClient instance across multiple requests.
export const db = globalThis.prisma || new PrismaClient().$extends(withAccelerate())

if (process.env.NODE_ENV === 'development') {
  globalThis.prisma = db
}

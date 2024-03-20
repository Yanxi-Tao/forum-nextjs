'use server'

import { z } from 'zod'
import { RegisterSchema } from '@/schemas'

export const register = async (data: z.infer<typeof RegisterSchema>) => {
  const validatedData = RegisterSchema.safeParse(data)

  if (!validatedData.success) {
    return { type: 'error', message: 'Invalid data' }
  }

  return {
    type: 'success',
    message: 'Verification email sent',
  }
}

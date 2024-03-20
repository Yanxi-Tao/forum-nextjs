'use server'

import { z } from 'zod'
import { LoginSchema } from '@/schemas'

export const login = async (data: z.infer<typeof LoginSchema>) => {
  const validatedData = LoginSchema.safeParse(data)

  if (!validatedData.success) {
    return { type: 'error', message: 'Invalid data' }
  }

  return {
    type: 'success',
    message: 'Verification email sent',
  }
}

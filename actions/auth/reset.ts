'use server'

import { z } from 'zod'
import { ResetSchema } from '@/schemas'
import { getUserByEmail } from '@/data/user'
import { generatePasswordResetToken } from '@/lib/tokens'
import { sendPasswordResetTokenEmail } from '@/lib/mail'

export const reset = async (data: z.infer<typeof ResetSchema>) => {
  const validatedData = ResetSchema.safeParse(data)

  if (!validatedData.success) {
    return { type: 'error', message: 'Invalid email' }
  }

  const { email } = validatedData.data

  const existingUser = await getUserByEmail(email)

  if (!existingUser) {
    return { type: 'error', message: 'Email not found' }
  }

  // Send email with reset token
  const passwordResetToken = await generatePasswordResetToken(email)
  if (!passwordResetToken) {
    return { type: 'error', message: 'An error occurred' }
  }
  const status = await sendPasswordResetTokenEmail(
    passwordResetToken.email,
    passwordResetToken.token
  )

  if (!status) {
    return { type: 'error', message: 'An error occurred' }
  }

  return { type: 'success', message: 'Reset password email sent' }
}

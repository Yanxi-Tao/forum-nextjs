'use server'

import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { RegisterSchema } from '@/schemas'
import { createUser, getUserByEmail } from '@/db/user'

export const register = async (data: z.infer<typeof RegisterSchema>) => {
  const validatedData = RegisterSchema.safeParse(data)

  if (!validatedData.success) {
    return { type: 'error', message: 'Invalid data' }
  }

  // Save user to database
  const { name, email, password } = validatedData.data

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Check if email already exists
  const isUserExist = await getUserByEmail(email)
  if (isUserExist) {
    return { type: 'error', message: 'Email already exists' }
  }

  // Send verification email

  // Create user
  createUser(name, email, hashedPassword)

  return {
    type: 'success',
    message: 'Verification email sent',
  }
}

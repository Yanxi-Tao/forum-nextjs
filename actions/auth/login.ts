'use server'

import { z } from 'zod'
import { signIn } from '@/auth'
import { LoginSchema } from '@/schemas'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { AuthError } from 'next-auth'
import { getUserByEmail } from '@/data/user'

export const login = async (
  data: z.infer<typeof LoginSchema>,
  callBackUrl?: string | null
) => {
  const validatedData = LoginSchema.safeParse(data)

  if (!validatedData.success) {
    return { type: 'error', message: 'Invalid data' }
  }

  const { email, password } = validatedData.data

  const checkUser = await getUserByEmail(email)

  if (!checkUser || !checkUser.email || !checkUser.password) {
    return { type: 'error', message: 'Invalid credentials' }
  }

  if (!checkUser.emailVerified) {
    return { type: 'error', message: 'Email not verified' }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: callBackUrl || DEFAULT_LOGIN_REDIRECT,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { type: 'error', message: 'Invalid credentials' }
        default:
          return { type: 'error', message: 'An error occurred' }
      }
    }

    throw error
  }
}

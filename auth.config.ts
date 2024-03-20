import type { NextAuthConfig } from 'next-auth'
import credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

import { LoginSchema } from '@/schemas'
import { getUserByEmail } from './db/user'

export default {
  providers: [
    credentials({
      // in case malicious login attempts directly to the auth API are made
      async authorize(credentials) {
        const validatedCredentials = LoginSchema.safeParse(credentials)
        if (validatedCredentials.success) {
          const { email, password } = validatedCredentials.data
          const user = await getUserByEmail(email)
          if (!user || !user.password) return null
          const passwordsMatch = await bcrypt.compare(password, user.password)
          if (passwordsMatch) return user
        }
        return null
      },
    }),
  ],
} satisfies NextAuthConfig

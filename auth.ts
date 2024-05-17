import NextAuth, { type DefaultSession } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { PrismaAdapter } from '@auth/prisma-adapter'

import { db } from '@/db/client'
import { getUserByEmail, getUserByID, getUserBySlug } from '@/data/user'
import { getAccountByUserId } from '@/data/account'

import { slugify } from '@/lib/slug'
import { LoginSchema } from '@/schemas'
import { UserRole } from '@prisma/client'

export type ExtendedUser = DefaultSession['user'] & {
  isOAuth: boolean
  slug: string
  id: string
  name: string
  email: string
  image: string | null
  role: UserRole
}

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser
  }
}

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  pages: {
    signOut: '/auth/register',
    signIn: '/auth/login',
    error: '/auth/error',
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  providers: [
    GitHub,
    Google,
    Credentials({
      authorize: async (credentials) => {
        'use server'
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
  events: {
    linkAccount: async ({ user }) => {
      'use server'
      if (!user || !user.id || !user.name) return
      let slug = slugify(user.name)
      while (await getUserBySlug(slug)) {
        slug = slugify(user.name)
      }
      await db.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
          slug,
          profile: { create: { bio: '', isPublic: true } },
        },
      })
    },
  },
  callbacks: {
    signIn: async ({ user, account }) => {
      'use server'
      if (account?.provider !== 'credentials') return true

      if (!user || !user.id || !user.email || !user.name) return false
      const checkUser = await getUserByID(user.id)
      if (!checkUser || !checkUser.emailVerified) return false

      return true
    },
    session: async ({ session, token }) => {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (session.user) {
        session.user.isOAuth = token.isOAuth as boolean
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.slug = token.slug as string
        session.user.image = token.image as string | null
        session.user.role = token.role as UserRole
      }

      return session
    },
    jwt: async ({ token }) => {
      'use server'
      if (!token.sub) return token

      const existingUser = await getUserByID(token.sub)

      if (!existingUser) return token

      const existingAccount = await getAccountByUserId(existingUser.id)

      token.isOAuth = !!existingAccount
      token.name = existingUser.name
      token.email = existingUser.email
      token.slug = existingUser.slug
      token.image = existingUser.image
      token.role = existingUser.role

      return token
    },
  },
})

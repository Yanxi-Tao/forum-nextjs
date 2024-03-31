import NextAuth, { type DefaultSession } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import authConfig from '@/auth.config'

import { db } from '@/db/client'
import { getUserByID } from '@/data/user'
import { getAccountByUserId } from '@/data/account'

import { slugify } from '@/lib/slug'

export type ExtendedUser = {
  isOAuth: boolean
  slug: string
} & DefaultSession['user']

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  events: {
    async linkAccount({ user }) {
      // update emailVerified field to current date for provider accounts
      if (!user || !user.id || !user.name) return
      const slug = slugify(user.name)
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date(), slug, profile: { create: {} } },
      })
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // allow oauth without email verification
      if (account?.provider !== 'credentials') return true

      // check if user exist or email is verified
      if (!user || !user.id) return false
      const checkUser = await getUserByID(user.id)
      if (!checkUser || !checkUser.emailVerified) return false

      return true
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (session.user) {
        session.user.isOAuth = token.isOAuth as boolean
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.slug = token.slug as string
      }

      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await getUserByID(token.sub)

      if (!existingUser) return token

      const existingAccount = await getAccountByUserId(existingUser.id)

      token.isOAuth = !!existingAccount
      token.name = existingUser.name
      token.email = existingUser.email
      token.slug = existingUser.slug

      return token
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
})

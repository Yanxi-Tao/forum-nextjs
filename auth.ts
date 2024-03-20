import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import authConfig from '@/auth.config'

import { db } from '@/db/client'
import { getUserByID } from '@/db/user'

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
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      })
    },
  },
  callbacks: {
    // async signIn({ user }) {
    //   if (!user || !user.id) return false
    //   const checkUser = await getUserByID(user.id)
    //   if (!checkUser || !checkUser.emailVerified) return false
    //   return true
    // },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token }) {
      return token
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
})

'use server'

import { z } from 'zod'
import bcrypt from 'bcryptjs'

import { SettingsSchema } from '@/schemas'
import { getUserByEmail, getUserByID } from '@/data/user'
import { currentUser } from '@/lib/auth'
import { db } from '@/db/client'
import { generateVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/mail'
import { slugify } from '@/lib/slug'

export const settings = async (data: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser()

  if (!user || !user.id) {
    return { type: 'error', message: 'Unauthorized' }
  }

  const dbUser = await getUserByID(user.id)

  if (!dbUser) {
    return { type: 'error', message: 'User not found' }
  }

  if (user.isOAuth) {
    data.email = undefined
    data.oldPassword = undefined
    data.newPassword = undefined
  }

  // if email is updated, send verification email
  if (data.email && data.email !== user.email) {
    const emailExists = await getUserByEmail(data.email)

    if (emailExists && emailExists.id !== user.id) {
      return { type: 'error', message: 'Email already exists' }
    }

    const verificationToken = await generateVerificationToken(data.email)
    await sendVerificationEmail(verificationToken.email, verificationToken.token)

    return { type: 'success', message: 'Verification email sent' }
  }

  // if password is updated, check if match database password
  // if match, hash the new password
  if (data.oldPassword && data.newPassword && dbUser.password) {
    const passwordMatch = await bcrypt.compare(data.oldPassword, dbUser.password)

    if (!passwordMatch) {
      return { type: 'error', message: 'Password Incorrect' }
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10)

    data.newPassword = hashedPassword
  }

  let slug = user.slug
  // if name is updated, slugify the name
  if (data.name && data.name !== user.name) {
    slug = slugify(data.name)
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      name: data.name,
      email: data.email,
      password: data.newPassword,
      slug,
    },
  })

  return { type: 'success', message: 'Settings updated' }
}

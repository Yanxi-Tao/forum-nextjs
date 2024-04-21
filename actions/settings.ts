'use server'

import bcrypt from 'bcryptjs'

import { UpdateSettingsSchema } from '@/schemas'
import { getUserByEmail, getUserByID, getUserBySlug } from '@/data/user'
import { currentUser } from '@/lib/auth'
import { db } from '@/db/client'
import { generateVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/mail'
import { slugify } from '@/lib/slug'
import { UpdateSettingsSchemaTypes } from '@/lib/types'

export const settings = async (data: UpdateSettingsSchemaTypes) => {
  const user = await currentUser()

  if (!user || !user.id) {
    return { type: 'error', message: 'Unauthorized' }
  }

  const dbUser = await getUserByID(user.id)

  if (!dbUser) {
    return { type: 'error', message: 'User not found' }
  }

  const validatedData = UpdateSettingsSchema.safeParse(data)
  if (!validatedData.success) {
    return { type: 'error', message: 'Invalid data' }
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

    let verificationToken = await generateVerificationToken(data.email)
    if (!verificationToken) {
      return { type: 'error', message: 'An error occurred' }
    }
    const status = await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    )

    if (!status) {
      return { type: 'error', message: 'An error occurred' }
    }

    return { type: 'success', message: 'Verification email sent' }
  }

  // if password is updated, check if match database password
  // if match, hash the new password
  if (data.oldPassword && data.newPassword && dbUser.password) {
    const passwordMatch = await bcrypt.compare(
      data.oldPassword,
      dbUser.password
    )

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
    while (await getUserBySlug(slug)) {
      slug = slugify(data.name)
    }
  }

  try {
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
  } catch {
    return { type: 'error', message: 'Failed to update settings' }
  }
}

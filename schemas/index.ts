import { PostType } from '@prisma/client'
import { z } from 'zod'

export const SettingsSchema = z
  .object({
    name: z.optional(z.string().min(1, { message: 'Name is required' })),
    email: z.optional(z.string().email({ message: 'Email is required' })),
    oldPassword: z.optional(z.string()),
    newPassword: z.optional(z.string()),
  })
  .refine(
    (data) => {
      if (data.oldPassword && !data.newPassword) {
        return false
      }

      return true
    },
    {
      message: 'New password is required!',
      path: ['newPassword'],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.oldPassword) {
        return false
      }

      return true
    },
    {
      message: 'Password is required!',
      path: ['password'],
    }
  )

export const ResetSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
})

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(3, { message: 'Password is required' }),
    confirmPassword: z.string().min(3, { message: 'Password is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
  password: z.string().min(3, { message: 'Password is required' }),
})

export const RegisterSchema = z
  .object({
    email: z.string().email({ message: 'Email is required' }),
    password: z.string().min(3, { message: 'Password is required' }),
    confirmPassword: z.string().min(3, { message: 'Password is required' }),
    name: z.string().min(1, { message: 'Name is required' }),
    code: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const CreatePostSchema = z
  .object({
    title: z.optional(
      z
        .string()
        .min(3, { message: 'Title is too short' })
        .max(100, { message: 'Title is too long' })
    ),
    type: z.nativeEnum(PostType),
    content: z.string().min(3, { message: 'Content is required' }),
    questionId: z.optional(z.string()),
    communityId: z.optional(z.string()),
  })
  .refine(
    (data) => {
      if (data.type !== PostType.ANSWER && !data.title) {
        return false
      }
    },
    { message: 'Title is required', path: ['title'] }
  )

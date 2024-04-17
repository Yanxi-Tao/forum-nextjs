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

export const CreatePostSchema = z.object({
  title: z.string().min(1).max(255),
  type: z.nativeEnum(PostType),
  content: z.string().min(1, { message: 'Required' }),
  parentId: z.optional(z.string()),
  communitySlug: z.optional(z.string()),
})

export const CreateCommentSchema = z.object({
  content: z.string().min(1, { message: 'Required' }),
  postId: z.optional(z.string()),
  parentId: z.optional(z.string()),
  repliesToId: z.optional(z.string()),
  repliesToName: z.optional(z.string()),
  repliesToSlug: z.optional(z.string()),
})

export const CreateCommunitySchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  isPublic: z.boolean(),
})

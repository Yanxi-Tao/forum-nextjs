import { PostType } from '@prisma/client'
import { z } from 'zod'

export const UpdateSettingsSchema = z
  .object({
    name: z.optional(
      z
        .string()
        .min(1, { message: 'Name is required' })
        .max(15, { message: 'Name is too long' })
    ),
    email: z.optional(z.string().email({ message: 'Email is required' })),
    oldPassword: z.optional(z.string()),
    newPassword: z.optional(z.string()),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.oldPassword) {
        return false
      }

      return true
    },
    {
      message: 'Password is required!',
      path: ['oldPassword'],
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

export const RegisterSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
  password: z.string().min(3, { message: 'Password is required' }),
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(15, { message: 'Name is too long' }),
  code: z.string(),
})

export const PostSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
})

export const CreatePostSchema = PostSchema.extend({
  type: z.nativeEnum(PostType),
  parentId: z.optional(z.string().cuid()),
  communitySlug: z.optional(z.string()),
})

export const UpdatePostSchema = PostSchema.extend({
  postId: z.string().cuid(),
})

export const CreateCommentSchema = z.object({
  content: z.string().min(1, { message: 'Required' }),
  postId: z.string(),
  parentId: z.optional(z.string()),
  repliesToUserId: z.optional(z.string()),
  repliesToCommentId: z.optional(z.string()),
})

export const CreateCommunitySchema = z.object({
  name: z.string().min(1).max(10),
  description: z.string().min(1).max(255),
  isPublic: z.boolean(),
})

export const UpdateCommunitySchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1).max(10),
  slug: z.string(),
  description: z.string().min(1).max(255),
  isPublic: z.boolean(),
})

export const UpdateProfileSchema = z.object({
  bio: z.optional(z.string().max(100)),
})

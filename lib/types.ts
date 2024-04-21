import { fetchPosts, fetchPostById } from '@/actions/post/fetch-post'
import { fetchComments } from '@/actions/comment/fetch-comment'
import { fetchCommunities } from '@/actions/community/fetch-community'
import { fetchEditProfile, fetchProfile } from '@/actions/profile/fetch-profile'
import { getCommunityBySlug } from '@/data/community'
import { fetchNofiications } from '@/actions/notification/fetch-notification'
import { z } from 'zod'
import {
  CreateCommentSchema,
  CreateCommunitySchema,
  CreatePostSchema,
  UpdateCommunitySchema,
  UpdatePostSchema,
  UpdateProfileSchema,
  UpdateSettingsSchema,
} from '@/schemas'

// Display types
export type QuestionDisplayProps = NonNullable<
  Awaited<ReturnType<typeof fetchPostById>>
>

export type ProfileDisplayProps = NonNullable<
  Awaited<ReturnType<typeof fetchProfile>>
>

export type CommunityDisplayProps = NonNullable<
  Awaited<ReturnType<typeof getCommunityBySlug>>
>

// Cards types
export type PostCardProps = Awaited<
  ReturnType<typeof fetchPosts>
>['posts'][number]

export type CommentCardProps = Omit<
  Awaited<ReturnType<typeof fetchComments>>[number],
  'children'
>

export type CommunityCardProps = Awaited<
  ReturnType<typeof fetchCommunities>
>['communities'][number]

export type NotificationCardProps = NonNullable<
  Awaited<ReturnType<typeof fetchNofiications>>
>[number]

// Tanstack query keys types
export type FetchPostQueryKey = {
  search?: string
  communitySlug?: string
  offset: number
  take: number
}
export type FetchAnswerQueryKey = {
  parentId: string
  offset: number
  take: number
}

export type FetchCommunityQueryKey = {
  search?: string
  offset: number
  take: number
}

// Form types
export type UpdateProfileFormProps = NonNullable<
  NonNullable<Awaited<ReturnType<typeof fetchEditProfile>>>['profile']
>

// zod schemas types
export type CreateCommentSchemaTypes = z.infer<typeof CreateCommentSchema>

export type CreatePostSchemaTypes = z.infer<typeof CreatePostSchema>

export type UpdatePostSchemaTypes = z.infer<typeof UpdatePostSchema>

export type CreateCommunitySchemaTypes = z.infer<typeof CreateCommunitySchema>

export type UpdateCommunitySchemaTypes = z.infer<typeof UpdateCommunitySchema>

export type UpdateProfileSchemaTypes = z.infer<typeof UpdateProfileSchema>

export type UpdateSettingsSchemaTypes = z.infer<typeof UpdateSettingsSchema>

// Other Props
export type FormAlertProps = {
  message: string
  type: string
} | null

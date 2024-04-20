import { fetchPosts, fetchPostById } from '@/actions/post/fetch-post'
import { fetchComments } from '@/actions/comment/fetch-comment'
import { fetchCommunities } from '@/actions/community/fetch-community'
import { off } from 'process'
import { fetchEditProfile, fetchProfile } from '@/actions/profile/fetch-profile'

// Display types
export type QuestionDisplayProps = NonNullable<
  Awaited<ReturnType<typeof fetchPostById>>
>

export type ProfileDisplayProps = NonNullable<
  Awaited<ReturnType<typeof fetchProfile>>
>

// Cards types
export type PostCardProps = Awaited<
  ReturnType<typeof fetchPosts>
>['posts'][number]

export type CommentCardProps = Omit<
  Awaited<ReturnType<typeof fetchComments>>[number],
  'children'
>

export type NestedCommentCardProps = Pick<
  Awaited<ReturnType<typeof fetchComments>>[number],
  'children'
>['children'][number]

export type CommunityCardProps = Awaited<
  ReturnType<typeof fetchCommunities>
>['communities'][number]

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
  Awaited<ReturnType<typeof fetchEditProfile>>
>

// Other Props
export type FormAlertProps = {
  message: string
  type: string
} | null

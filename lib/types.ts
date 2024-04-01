import { fetchPosts, fetchPostById } from '@/actions/post/fetch-post'
import { fetchComments } from '@/actions/comment/fetch-comment'

// Display types
export type QuestionDisplayProps = NonNullable<Awaited<ReturnType<typeof fetchPostById>>>

// Cards types
export type PostCardProps = Awaited<ReturnType<typeof fetchPosts>>['posts'][number]

export type CommentCardProps = Omit<Awaited<ReturnType<typeof fetchComments>>[number], 'children'>

export type NestedCommentCardProps = Pick<Awaited<ReturnType<typeof fetchComments>>[number], 'children'>['children'][number]

// Tanstack query keys types
export type FetchPostQueryKey = {
  search?: string
  communityName?: string
  offset: number
  take: number
}
export type FetchAnswerQueryKey = {
  parentId: string
  offset: number
  take: number
}

// Other Props
export type FormAlertProps = {
  message: string
  type: string
} | null

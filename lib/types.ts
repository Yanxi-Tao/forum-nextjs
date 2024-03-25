import { getAnswersByQuestionSlug } from '@/db/answer'
import { getQuestionBySlug } from '@/db/post'
import { Comment, Community, Post, PostType } from '@prisma/client'

// Card Props
export type AnswerCardProps = NonNullable<
  Awaited<ReturnType<typeof getAnswersByQuestionSlug>>
>[0]

export type CommentCardProps = Comment

export type CommunityCardProps = Community & {
  postsCount: number
  membersCount: number
}

export type QuestionOrArticleCardProps = Post & {
  commentsCount: number
  communitySlug: string | undefined
  communityName: string | undefined
  authorName: string
  authorSlug: string
}

// Page Props
export type QuestionDisplayProps = Awaited<ReturnType<typeof getQuestionBySlug>>

// Form Props
export type CreatePostType = Exclude<PostType, 'ANSWER'>

// Other Props
export type FormAlertProps = {
  message: string | null
  type: string | null
}

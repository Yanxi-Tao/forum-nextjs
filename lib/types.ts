import { fetchQuestionInitial } from '@/actions/post'
import { getAnswersByQuestionSlug } from '@/db/answer'
import { getQuestionBySlug } from '@/db/post'
import { Comment, Community, Post, PostType } from '@prisma/client'

// db query return types
type FetchQuestionInitial = Awaited<ReturnType<typeof fetchQuestionInitial>>

// Page Display Props
export type QuestionDisplayType = {
  question: NonNullable<FetchQuestionInitial['question']>
  initialAnswers: NonNullable<FetchQuestionInitial>['initialAnswers']
  myCursor: NonNullable<FetchQuestionInitial>['myCursor']
}

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

// Form Props
export type CreatePostType = Exclude<PostType, 'ANSWER'>

// Other Props
export type FormAlertProps = {
  message: string | null
  type: string | null
}

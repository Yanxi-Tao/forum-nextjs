import { fetchPostsInitial, fetchQuestionInitial } from '@/actions/post'
import { Comment, Community, Post, PostType } from '@prisma/client'

// db query return types
type FetchQuestionInitial = Awaited<ReturnType<typeof fetchQuestionInitial>>
type FetchPostsInitial = Awaited<ReturnType<typeof fetchPostsInitial>>

// Page Display Props
export type QuestionDisplayType = {
  question: NonNullable<FetchQuestionInitial['question']>
  initialAnswers: NonNullable<FetchQuestionInitial>['initialAnswers']
  myCursor: NonNullable<FetchQuestionInitial>['myCursor']
}
export type ExploreDisplayType = {
  searchParams?: { [key: string]: string | undefined }
  initialPosts: NonNullable<FetchPostsInitial['initialPosts']>
  myCursor: NonNullable<FetchPostsInitial>['myCursor']
}

// Card Props
export type AnswerCardProps = NonNullable<
  FetchQuestionInitial['initialAnswers']
>[number]

export type PostCardProps = NonNullable<
  FetchPostsInitial['initialPosts']
>[number]

export type CommentCardProps = Comment

export type CommunityCardProps = Community & {
  postsCount: number
  membersCount: number
}

// Form Props
export type CreatePostType = Exclude<PostType, 'ANSWER'>

// Other Props
export type FormAlertProps = {
  message: string | null
  type: string | null
}

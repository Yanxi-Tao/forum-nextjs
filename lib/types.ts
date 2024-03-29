import {
  fetchComments,
  fetchSubComments,
} from '@/actions/comment/fetch-comment'
import { fetchAnswers, fetchPost, fetchPosts } from '@/actions/post/fetch-post'

// Fetched Data Props
export type PostsDataProps = Awaited<ReturnType<typeof fetchPosts>>
export type PostDataProps = Awaited<ReturnType<typeof fetchPost>>
export type AnswersDataProps = Awaited<ReturnType<typeof fetchAnswers>>
export type CommentsDataProps = Awaited<ReturnType<typeof fetchComments>>
export type SubCommentsDataProps = Awaited<ReturnType<typeof fetchSubComments>>

// Cards Props
export type PostCardProps = Awaited<
  ReturnType<typeof fetchPosts>
>['posts'][number]

export type AnswerCardProps = Awaited<
  ReturnType<typeof fetchAnswers>
>['answers'][number]

export type CommentCardProps = Awaited<
  ReturnType<typeof fetchComments>
>['comments'][number] &
  Awaited<ReturnType<typeof fetchSubComments>>['subComments'][number]

// Other Props
export type FormAlertProps = {
  message: string | null
  type: string | null
}

import { fetchAnswers, fetchPost, fetchPosts } from '@/actions/post/fetch-post'

// Fetched Data Props
export type PostsDataProps = Awaited<ReturnType<typeof fetchPosts>>
export type PostDataProps = Awaited<ReturnType<typeof fetchPost>>
export type AnswersDataProps = Awaited<ReturnType<typeof fetchAnswers>>

// Cards Props
export type PostCardProps = Awaited<
  ReturnType<typeof fetchPosts>
>['posts'][number]

// Other Props
export type FormAlertProps = {
  message: string | null
  type: string | null
}

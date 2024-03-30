import { fetchPosts, fetchPostById } from '@/actions/post/fetch-post'

// Display types
export type QuestionDisplayProps = NonNullable<
  Awaited<ReturnType<typeof fetchPostById>>
>

// Cards types
export type PostCardProps = Awaited<
  ReturnType<typeof fetchPosts>
>['posts'][number]

// Tanstack query keys types
export type FetchPostQueryKey = [
  string,
  {
    search?: string
    communityName?: string
    offset: number
    take: number
  }
]
export type FetchAnswerQueryKey = [
  string,
  {
    parentId: string
    offset: number
    take: number
  }
]

// Other Props
export type FormAlertProps = {
  message: string
  type: string
} | null

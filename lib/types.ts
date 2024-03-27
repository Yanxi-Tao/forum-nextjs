import { fetchPosts } from '@/actions/post/fetch-post'

// Fetched Data Props
export type PostDataProps = Awaited<ReturnType<typeof fetchPosts>>

// Cards Props
export type PostCardProps = Awaited<
  ReturnType<typeof fetchPosts>
>['posts'][number]

// Other Props
export type FormAlertProps = {
  message: string | null
  type: string | null
}

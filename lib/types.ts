import { fetchPosts } from '@/actions/post/fetch-post'

// Cards Props
export type PostCardProps = Awaited<
  ReturnType<typeof fetchPosts>
>['posts'][number]

// Other Props
export type FormAlertProps = {
  message: string | null
  type: string | null
}

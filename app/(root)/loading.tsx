import { PostCardSkeleton } from '@/components/skeleton/post-card-skeleton'

export default function Loading() {
  return (
    <div className="flex flex-col space-y-4 w-full">
      <PostCardSkeleton />
      <PostCardSkeleton />
      <PostCardSkeleton />
    </div>
  )
}

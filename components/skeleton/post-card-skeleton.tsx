import { Skeleton } from '@/components/ui/skeleton'

export const PostCardSkeleton = () => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col space-y-1 w-full">
          <Skeleton className="h-8 w-1/4" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-6 w-4/5" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-1/6" />
      </div>
    </div>
  )
}

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { ExploreDisplay } from '@/components/display/explore-display'
import { fetchPost } from '@/actions/post/fetch-post'
import { FetchPostQueryKey } from '@/lib/types'

export default async function ExplorePage({}) {
  const queryClient = new QueryClient()

  const queryKey: FetchPostQueryKey = [
    'explore',
    {
      search: undefined,
      communityName: undefined,
      offset: 0,
      take: 5,
    },
  ]

  await queryClient.prefetchInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => fetchPost(pageParam),
    initialPageParam: { queryKey },
    gcTime: Infinity,
  })
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ExploreDisplay />
    </HydrationBoundary>
  )
}

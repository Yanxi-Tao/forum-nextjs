import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { ExploreDisplay } from '@/components/display/explore-display'
import { fetchPosts } from '@/actions/post/fetch-post'
import { FetchPostQueryKey } from '@/lib/types'
import { POST_FETCH_SPAN } from '@/lib/constants'

export default async function ExplorePage({}) {
  const queryClient = new QueryClient()

  const queryKey: FetchPostQueryKey = [
    'explore',
    {
      search: undefined,
      communityName: undefined,
      offset: 0,
      take: POST_FETCH_SPAN,
    },
  ]

  await queryClient.prefetchInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => fetchPosts(pageParam),
    initialPageParam: { queryKey },
  })
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ExploreDisplay />
    </HydrationBoundary>
  )
}

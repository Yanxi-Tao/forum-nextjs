import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { ExploreDisplay } from '@/components/display/explore-display'
import { fetchPosts } from '@/actions/post/fetch-post'
import { EXPLORE_POSTS_KEY, POST_FETCH_SPAN } from '@/lib/constants'

export default async function ExplorePage({ searchParams }: { searchParams: { search: string | undefined } }) {
  const queryClient = new QueryClient()
  const search = searchParams.search

  await queryClient.prefetchInfiniteQuery({
    queryKey: [EXPLORE_POSTS_KEY],
    queryFn: ({ pageParam }) => fetchPosts(pageParam),
    initialPageParam: {
      search,
      communityName: undefined,
      offset: 0,
      take: POST_FETCH_SPAN,
    },
    gcTime: Infinity,
    staleTime: Infinity,
  })
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ExploreDisplay />
    </HydrationBoundary>
  )
}

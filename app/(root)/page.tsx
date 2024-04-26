import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { ExploreDisplay } from '@/components/display/explore-display'
import { fetchPosts } from '@/actions/post/fetch-post'
import { EXPLORE_POSTS_KEY, POST_FETCH_SPAN } from '@/lib/constants'
import PulseLoader from 'react-spinners/PulseLoader'
import { Suspense } from 'react'

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { search: string | undefined }
}) {
  const queryClient = new QueryClient()
  const search = searchParams.search

  await queryClient.prefetchInfiniteQuery({
    queryKey: [EXPLORE_POSTS_KEY, { undefined }],
    queryFn: ({ pageParam }) => fetchPosts(pageParam),
    initialPageParam: {
      search,
      communitySlug: undefined,
      offset: 0,
      take: POST_FETCH_SPAN,
    },
    staleTime: Infinity,
  })
  return (
    <Suspense
      fallback={
        <div className="flex justify-center my-10">
          <PulseLoader color="#8585ad" />
        </div>
      }
    >
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ExploreDisplay />
      </HydrationBoundary>
    </Suspense>
  )
}

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { ExploreDisplay as CommunityExploreDisplay } from '@/components/display/explore-display'
import { fetchPosts } from '@/actions/post/fetch-post'
import {
  COMMUNITY_DISPLAY_KEY,
  EXPLORE_POSTS_KEY,
  POST_FETCH_SPAN,
} from '@/lib/constants'

import { getCommunityBySlug } from '@/data/community'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CommunityDisplay } from '@/components/display/community-display'

export default async function CommunityPage({
  params: { slug },
  searchParams,
}: {
  params: { slug: string }
  searchParams: { search: string | undefined }
}) {
  const community = await getCommunityBySlug(slug)
  if (!community) return null

  const queryClient = new QueryClient()
  const search = searchParams.search

  await queryClient.prefetchInfiniteQuery({
    queryKey: [EXPLORE_POSTS_KEY, { communitySlug: slug }],
    queryFn: ({ pageParam }) => fetchPosts(pageParam),
    initialPageParam: {
      search,
      communitySlug: slug,
      offset: 0,
      take: POST_FETCH_SPAN,
    },
    gcTime: Infinity,
    staleTime: Infinity,
  })

  return (
    <Card className="border-0 shadow-none space-y-3">
      {!search && <CommunityDisplay community={community} />}
      <CardContent>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <CommunityExploreDisplay communitySlug={slug} />
        </HydrationBoundary>
      </CardContent>
    </Card>
  )
}

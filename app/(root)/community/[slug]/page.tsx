import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { ExploreDisplay } from '@/components/display/explore-display'
import { fetchPosts } from '@/actions/post/fetch-post'
import { EXPLORE_POSTS_KEY, POST_FETCH_SPAN } from '@/lib/constants'

import { getCommunityBySlug } from '@/data/community'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AvatarCard } from '@/components/card/avatar-card'
import { HiDotsHorizontal } from 'react-icons/hi'

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
    <Card className="border-0 shadow-none">
      <CardHeader className="bg-muted rounded-xl">
        <div className="relative flex justify-between">
          <AvatarCard source={community.image} name={community.name} className="h-36 w-36 text-3xl" />
          <div className="absolute left-28 top-28">
            <CardTitle className="bg-muted rounded-lg p-1 px-2">{community.name}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="h-fit">
              <HiDotsHorizontal size={20} />
            </DropdownMenuTrigger>
            {/* <DropdownMenuContent></DropdownMenuContent> */}
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ExploreDisplay communitySlug={slug} />
        </HydrationBoundary>
      </CardContent>
    </Card>
  )
}
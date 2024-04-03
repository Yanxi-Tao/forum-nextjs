import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'

import Link from 'next/link'
import { SearchIcon } from 'lucide-react'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { fetchCommunities, fetchCommunitiesByUser } from '@/actions/community/fetch-community'
import { COMMUNITY_FETCH_SPAN, COMMUNITY_KEY } from '@/lib/constants'
import { CommunityCardList } from '@/components/card/community-card-list'
import { CommunityCard } from '@/components/card/community-card'
import { currentUser } from '@/lib/auth'

export default async function CommunitiesPage() {
  const user = await currentUser()
  if (!user || !user.id) return null
  const queryClient = new QueryClient()
  await queryClient.prefetchInfiniteQuery({
    queryKey: [COMMUNITY_KEY],
    queryFn: ({ pageParam }) => fetchCommunities(pageParam),
    initialPageParam: { search: undefined, offset: 0, take: COMMUNITY_FETCH_SPAN },
  })
  const communities = await fetchCommunitiesByUser(user.id)
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="flex-row space-y-0 justify-between">
        <CardTitle>Communities</CardTitle>
        <Button>
          <Link href="/communities/create">Create</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs className="w-full" defaultValue="subscribed">
          <TabsList className="w-full">
            <TabsTrigger value="subscribed" className="w-full">
              My
            </TabsTrigger>
            <TabsTrigger value="browse" className="w-full">
              Browse
            </TabsTrigger>
          </TabsList>
          <TabsContent value="subscribed" className="w-full">
            <div className="flex flex-col space-y-2 overflow-auto h-[calc(100vh-270px)]">
              {communities.map((community) => (
                <CommunityCard key={community.id} {...community} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="browse" className="w-full">
            <HydrationBoundary state={dehydrate(queryClient)}>
              <CommunityCardList />
            </HydrationBoundary>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

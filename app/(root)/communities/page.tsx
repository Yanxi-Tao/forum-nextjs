import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'

import Link from 'next/link'
import { SearchIcon } from 'lucide-react'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { fetchCommunities } from '@/actions/community/fetch-community'
import { COMMUNITY_FETCH_SPAN, COMMUNITY_KEY } from '@/lib/constants'
import { CommunityCardList } from '@/components/card/community-card-list'
import { CommunityCard } from '@/components/card/community-card'

export default async function CommunitiesPage() {
  const queryClient = new QueryClient()
  await queryClient.prefetchInfiniteQuery({
    queryKey: [COMMUNITY_KEY],
    queryFn: ({ pageParam }) => fetchCommunities(pageParam),
    initialPageParam: { search: undefined, offset: 0, take: COMMUNITY_FETCH_SPAN },
  })
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
            Subscribed
          </TabsContent>
          <TabsContent value="browse" className="w-full">
            <HydrationBoundary state={dehydrate(queryClient)}>
              <CommunityCardList />
            </HydrationBoundary>
            {/* <CommunityCard
              id={'testId'}
              name={'testName'}
              slug={'testSlug'}
              image={null}
              ownerId={'testOwnerId'}
              description={`Hey fellow space adventurers! 🚀 Have you ever stumbled upon a gem of a sci-fi flick that left you in awe, yet hardly anyone seems to know about it? Let's talk about those hidden treasures lurking in the vast expanse of cinematic space! Share your picks and let's uncover the underrated masterpieces together! 🎥✨`}
              isPublic={true}
              createdAt={new Date()}
              updatedAt={new Date()}
            /> */}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

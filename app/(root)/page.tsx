import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { ExploreDisplay } from '@/components/display/explore-display'
import { fetchPost } from '@/actions/post/fetch-post'
import { FetchPostQueryKey } from '@/lib/types'
import { PostCard } from '@/components/card/post-card'

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
  // return (
  //   <PostCard
  //     community={{
  //       id: '',
  //       name: 'communityName',
  //       description: '',
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     }}
  //     author={{
  //       id: '',
  //       name: 'authorName',
  //       email: '',
  //       slug: null,
  //       emailVerified: null,
  //       image: null,
  //       password: null,
  //     }}
  //     _count={{ children: 0 }}
  //     id={''}
  //     title="question lalaal"
  //     content={''}
  //     type={'question'}
  //     authorId={''}
  //     createdAt={new Date()}
  //     updatedAt={new Date()}
  //     votes={0}
  //     views={0}
  //     bookmarks={0}
  //     parentId={null}
  //     communityId={null}
  //   />
  // )
}

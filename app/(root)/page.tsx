import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { ExploreDisplay } from '@/components/display/explore-display'
import { fetchPosts } from '@/actions/post/fetch-post'
import { EXPLORE_POSTS_KEY, POST_FETCH_SPAN } from '@/lib/constants'
import { CommentCard } from '@/components/card/comment-card'

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { search: string | undefined }
}) {
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
    // <HydrationBoundary state={dehydrate(queryClient)}>
    //   <ExploreDisplay />
    // </HydrationBoundary>
    <CommentCard
      comment={{
        author: {
          id: 'testId',
          name: 'testName',
          email: 'testEmail',
          slug: 'testSlug',
          emailVerified: new Date(),
          image: null,
          password: null,
        },
        repliesTo: {
          id: 'repliesId',
          name: 'repliesName',
          email: 'repliesEmail',
          slug: 'repliesSlug',
          emailVerified: new Date(),
          image: null,
          password: null,
        },
        _count: { children: 0 },
        id: 'testId',
        content: 'test content',
        authorId: 'testAuthorId',
        createdAt: new Date(),
        updatedAt: new Date(),
        votes: 100,
        postId: null,
        parentId: null,
        repliesToId: null,
      }}
    />
  )
}

'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchPost } from '@/actions/post/fetch-post'
import { FetchPostQueryKey } from '@/lib/types'
import { PostCard } from '../card/post-card'

export const ExploreDisplay = () => {
  const queryKey: FetchPostQueryKey = [
    'explore',
    {
      search: undefined,
      communityName: undefined,
      offset: 0,
      take: 10,
    },
  ]
  const { data, isSuccess } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => fetchPost(pageParam),
    initialPageParam: { queryKey },
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) =>
      lastPage.nextOffset
        ? { ...lastPageParam, offset: lastPage.nextOffset }
        : null,
  })

  return (
    <div className="flex flex-col space-y-3">
      {isSuccess &&
        data.pages.map((page) =>
          page.posts.map((post) => <PostCard key={post.id} {...post} />)
        )}
    </div>
  )
}

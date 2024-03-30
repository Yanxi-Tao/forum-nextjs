'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchPost } from '@/actions/post/fetch-post'
import { FetchPostQueryKey } from '@/lib/types'

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
  const { data } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => fetchPost(pageParam),
    initialPageParam: { queryKey },
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) =>
      lastPage.nextOffset
        ? { ...lastPageParam, offset: lastPage.nextOffset }
        : null,
  })
  console.log(data)

  return <div>Explore Display</div>
}

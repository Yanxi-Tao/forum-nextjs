'use client'

import { fetchPosts } from '@/actions/post/fetch-post'
import { EXPLORE_POSTS_KEY, POST_FETCH_SPAN } from '@/lib/constants'
import { useInfiniteQuery } from '@tanstack/react-query'

export const usePostsInfiniteQuery = (search: string | undefined) => {
  return useInfiniteQuery({
    queryKey: [EXPLORE_POSTS_KEY],
    queryFn: ({ pageParam }) => fetchPosts(pageParam),
    initialPageParam: {
      search,
      communityName: undefined,
      offset: 0,
      take: POST_FETCH_SPAN,
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.nextOffset) return undefined
      return {
        search,
        communityName: undefined,
        offset: lastPage.nextOffset,
        take: POST_FETCH_SPAN,
      }
    },
    gcTime: Infinity,
    staleTime: Infinity,
  })
}

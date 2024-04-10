'use client'

import { fetchPosts } from '@/actions/post/fetch-post'
import { EXPLORE_POSTS_KEY, POST_FETCH_SPAN } from '@/lib/constants'
import { useInfiniteQuery } from '@tanstack/react-query'

/**
 *
 * @param search
 * @returns UseInfiniteQueryResult
 *
 * used for fetching posts with infinite scroll
 * optionally takes a search parameter
 */
export const useInfinitePosts = (search: string | undefined, communitySlug: string | undefined) => {
  return useInfiniteQuery({
    queryKey: [EXPLORE_POSTS_KEY, { communitySlug }],
    queryFn: ({ pageParam }) => fetchPosts(pageParam),
    initialPageParam: {
      search,
      communitySlug,
      offset: 0,
      take: POST_FETCH_SPAN,
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.nextOffset) return undefined
      return {
        search,
        communitySlug,
        offset: lastPage.nextOffset,
        take: POST_FETCH_SPAN,
      }
    },
    gcTime: Infinity,
    staleTime: Infinity,
  })
}

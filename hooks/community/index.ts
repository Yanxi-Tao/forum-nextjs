'use client'

import { fetchCommunities } from '@/actions/community/fetch-community'
import { COMMUNITY_FETCH_SPAN, COMMUNITY_KEY } from '@/lib/constants'
import { useInfiniteQuery } from '@tanstack/react-query'

export const useInfiniteCommunities = (search: string | undefined) => {
  return useInfiniteQuery({
    queryKey: [COMMUNITY_KEY, { search }],
    queryFn: ({ pageParam }) => fetchCommunities(pageParam),
    initialPageParam: {
      search,
      offset: 0,
      take: COMMUNITY_FETCH_SPAN,
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.nextOffset) return undefined
      return {
        search,
        offset: lastPage.nextOffset,
        take: COMMUNITY_FETCH_SPAN,
      }
    },
    gcTime: Infinity,
    staleTime: Infinity,
  })
}

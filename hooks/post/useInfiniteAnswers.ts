'use client'

import { fetchAnswers } from '@/actions/post/fetch-post'
import { QUESTION_ANSWERS_KEY } from '@/lib/constants'
import { FetchAnswerQueryKey } from '@/lib/types'
import { useInfiniteQuery } from '@tanstack/react-query'

/**
 *
 * @param parentId
 * @param offset
 * @param take
 * @returns UseInfiniteQueryResult
 *
 * used for fetching answers to a question with infinite scroll
 */
export const useInfiniteAnswers = ({ parentId, offset, take }: FetchAnswerQueryKey) => {
  return useInfiniteQuery({
    queryKey: [QUESTION_ANSWERS_KEY],
    queryFn: ({ pageParam }) => fetchAnswers(pageParam),
    initialPageParam: { parentId, offset, take },
    getNextPageParam: (lastPage) => {
      if (!lastPage.nextOffset) return undefined
      return {
        parentId,
        offset: lastPage.nextOffset,
        take,
      }
    },
    gcTime: Infinity,
    staleTime: Infinity,
  })
}

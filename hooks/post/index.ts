'use client'

import { updateCommentVoteById } from '@/actions/comment/update-comment'
import { deletePost } from '@/actions/post/delete-post'
import {
  fetchAnswer,
  fetchAnswers,
  fetchPostById,
  fetchPosts,
} from '@/actions/post/fetch-post'
import {
  updatePostBookmarkById,
  updatePostVoteById,
} from '@/actions/post/update-post'
import {
  ANSWERS_FETCH_SPAN,
  EXPLORE_POSTS_KEY,
  MY_ANSWER_KEY,
  POST_FETCH_SPAN,
  QUESTION_ANSWERS_KEY,
  REDIRECT_ANSWER_KEY,
} from '@/lib/constants'
import { PostType } from '@prisma/client'
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { debounce } from 'radash'

export const useDeletePost = (postId: string, postType: PostType) => {
  const queryKey =
    postType === 'question' ? EXPLORE_POSTS_KEY : QUESTION_ANSWERS_KEY
  const queryClient = useQueryClient()
  const mutate = useMutation({
    mutationFn: () => deletePost(postId, postType),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKey],
      })
      await queryClient.invalidateQueries({
        queryKey: [MY_ANSWER_KEY],
      })
    },
  })
  return mutate.mutate
}

/**
 *
 * @param search
 * @returns UseInfiniteQueryResult
 *
 * used for fetching posts with infinite scroll
 * optionally takes a search parameter
 */
export const useInfinitePosts = (
  search: string | undefined,
  communitySlug: string | undefined
) => {
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
    staleTime: Infinity,
  })
}

/**
 *
 * @param parentId
 * @param offset
 * @param take
 * @returns UseInfiniteQueryResult
 *
 * used for fetching answers to a question with infinite scroll
 */
export const useInfiniteAnswers = (parentId: string) => {
  return useInfiniteQuery({
    queryKey: [QUESTION_ANSWERS_KEY],
    queryFn: ({ pageParam }) => fetchAnswers(pageParam),
    initialPageParam: { parentId, offset: 0, take: ANSWERS_FETCH_SPAN },
    getNextPageParam: (lastPage) => {
      if (!lastPage.nextOffset) return undefined
      return {
        parentId,
        offset: lastPage.nextOffset,
        take: ANSWERS_FETCH_SPAN,
      }
    },
    staleTime: Infinity,
  })
}

export const useRedirectAnswer = (answerId: string | undefined) => {
  return useQuery({
    queryKey: [REDIRECT_ANSWER_KEY],
    queryFn: () => fetchPostById(answerId),
    staleTime: Infinity,
    enabled: !!answerId,
  })
}

export const useMyAnswer = (userId: string | undefined, postId: string) => {
  return useQuery({
    queryKey: [MY_ANSWER_KEY],
    queryFn: () => fetchAnswer(userId, postId),
    staleTime: Infinity,
  })
}

export const useUpdateBookmark = () => {
  return debounce({ delay: 1000 }, updatePostBookmarkById)
}

export const useUpdateVote = (type: 'post' | 'comment') => {
  return type === 'comment'
    ? debounce({ delay: 1000 }, updateCommentVoteById)
    : debounce({ delay: 1000 }, updatePostVoteById)
}

'use client'

import { updateCommentVoteById } from '@/actions/comment/update-comment'
import { createPost } from '@/actions/post/create-post'
import { deletePost } from '@/actions/post/delete-post'
import { fetchAnswers, fetchPosts } from '@/actions/post/fetch-post'
import {
  updatePost,
  updatePostBookmarkById,
  updatePostVoteById,
} from '@/actions/post/update-post'
import {
  EXPLORE_POSTS_KEY,
  MY_ANSWER_KEY,
  POST_FETCH_SPAN,
  QUESTION_ANSWERS_KEY,
} from '@/lib/constants'
import {
  CreatePostSchemaTypes,
  FetchAnswerQueryKey,
  UpdatePostSchemaTypes,
} from '@/lib/types'
import { PostType } from '@prisma/client'
import {
  useInfiniteQuery,
  useMutation,
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
    gcTime: Infinity,
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
export const useInfiniteAnswers = ({
  parentId,
  offset,
  take,
}: FetchAnswerQueryKey) => {
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

/**
 *
 * @param queryClient
 * @returns UseMutationResult
 *
 * used for creating new answer to a question with optimistic update
 * and invalidating the cache
 */

// export const useMutateAnswer = () => {
//   return useMutation()
// }

export const useUpdateBookmark = () => {
  return debounce({ delay: 1000 }, updatePostBookmarkById)
}

export const useUpdateVote = (type: 'post' | 'comment') => {
  return type === 'comment'
    ? debounce({ delay: 1000 }, updateCommentVoteById)
    : debounce({ delay: 1000 }, updatePostVoteById)
}

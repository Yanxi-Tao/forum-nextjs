'use client'

import { createComment } from '@/actions/comment/create-comment'
import { deleteComment } from '@/actions/comment/delete-comment'
import { fetchComments } from '@/actions/comment/fetch-comment'
import { COMMENT_KEY } from '@/lib/constants'
import { CreateCommentSchemaTypes } from '@/lib/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

/*
    This hook is used for updating a comment with optimistic update
    and invalidating the cache
*/
export const useDeleteComment = (postId: string) => {
  const queryClient = useQueryClient()
  const mutate = useMutation({
    mutationFn: deleteComment,
    onSettled: async () =>
      await queryClient.invalidateQueries({
        queryKey: [COMMENT_KEY, postId],
      }),
  })
  return mutate.mutate
}

export const useComments = (postId: string) => {
  return useQuery({
    queryKey: [COMMENT_KEY, postId],
    queryFn: () => fetchComments(postId),
    gcTime: Infinity,
    staleTime: Infinity,
  })
}

export const useCreateComment = (postId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCommentSchemaTypes) => createComment(data),
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: [COMMENT_KEY, postId],
      })
    },
  })
}

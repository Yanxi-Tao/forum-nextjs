'use client'

import { createPost } from '@/actions/post/create-post'
import { QUESTION_ANSWERS_KEY } from '@/lib/constants'
import { CreatePostSchema } from '@/schemas'
import { QueryClient, useMutation } from '@tanstack/react-query'
import { z } from 'zod'

/**
 *
 * @param queryClient
 * @returns UseMutationResult
 *
 * used for creating new answer to a question with optimistic update
 * and invalidating the cache
 */
export const useMutateAnswer = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: (data: z.infer<typeof CreatePostSchema>) => createPost(data),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUESTION_ANSWERS_KEY] })
    },
  })
}

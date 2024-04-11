'use client'

import { fetchComments } from '@/actions/comment/fetch-comment'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CommentForm } from '@/components/form/comment-form'
import { createComment } from '@/actions/comment/create-comment'
import { CreateCommentSchema } from '@/schemas'
import { z } from 'zod'
import { CommentCard, NestedCommentCard, optimisticComment, optimisticNestedComment } from '@/components/card/comment-card'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { BeatLoader } from 'react-spinners'
import { COMMENT_KEY } from '@/lib/constants'

export const CommentDisplay = ({ postId }: { postId: string }) => {
  const user = useCurrentUser()
  const queryClient = useQueryClient()
  const { data, fetchStatus, isSuccess } = useQuery({
    queryKey: [COMMENT_KEY, postId],
    queryFn: () => fetchComments(postId),
    gcTime: Infinity,
    staleTime: Infinity,
  })

  const { isPending, mutate, variables } = useMutation({
    mutationFn: (data: z.infer<typeof CreateCommentSchema>) => createComment(data),
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: [COMMENT_KEY, postId],
      })
    },
  })

  if (!user) return null
  return (
    <div className="flex flex-col gap-y-4 px-6">
      <CommentForm
        postId={postId}
        parentId={undefined}
        repliesToId={undefined}
        repliesToName={undefined}
        repliesToSlug={undefined}
        mutate={mutate}
      />
      <div className=" max-h-[400px] overflow-x-auto px-3">
        {variables?.postId && isPending && <CommentCard comment={optimisticComment(variables, user)} mutate={mutate} />}
        {isSuccess &&
          data.map((comment) => (
            <div key={comment.id}>
              <CommentCard comment={comment} mutate={mutate} />
              <div className=" pl-12 w-full">
                {variables?.parentId === comment.id && isPending && (
                  <NestedCommentCard
                    parentId={comment.id}
                    comment={optimisticNestedComment(variables, user)}
                    mutate={mutate}
                    postId={postId}
                  />
                )}
                {comment.children.map((nestedComment) => (
                  <NestedCommentCard parentId={comment.id} key={nestedComment.id} comment={nestedComment} mutate={mutate} postId={postId} />
                ))}
              </div>
            </div>
          ))}
        {fetchStatus === 'fetching' ? (
          <div className="flex justify-center h-10 my-4">
            <BeatLoader className="h-10" />
          </div>
        ) : (
          <div className="flex items-center h-10 my-4 px-20">
            <div className="w-full border-b-2" />
          </div>
        )}
      </div>
    </div>
  )
}

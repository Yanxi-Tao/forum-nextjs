'use client'

import { CommentForm } from '@/components/form/comment-form'
import { CommentCard, optimisticComment } from '@/components/card/comment-card'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { BeatLoader } from 'react-spinners'
import { useComments, useCreateComment } from '@/hooks/comment'

export const CommentDisplay = ({ postId }: { postId: string }) => {
  const user = useCurrentUser()
  const { data, fetchStatus, isSuccess } = useComments(postId)
  const { isPending, mutate, variables } = useCreateComment(postId)

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
      <div className="max-h-[400px] overflow-y-auto">
        {!variables?.parentId && isPending && (
          <CommentCard
            comment={optimisticComment(variables, user)}
            mutate={mutate}
          />
        )}
        {isSuccess &&
          data.map((comment) => (
            <div key={comment.id}>
              <CommentCard comment={comment} mutate={mutate} />
              <div className=" pl-12 w-full">
                {variables?.parentId === comment.id && isPending && (
                  <CommentCard
                    comment={optimisticComment(variables, user)}
                    mutate={mutate}
                  />
                )}
                {comment.children.map((nestedComment) => (
                  <CommentCard
                    key={nestedComment.id}
                    comment={nestedComment}
                    mutate={mutate}
                  />
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

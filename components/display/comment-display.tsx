'use client'

import { CommentForm } from '@/components/form/comment-form'
import { CommentCard } from '@/components/card/comment-card'
import { useCurrentUser } from '@/hooks/user'
import { BeatLoader } from 'react-spinners'
import { useComments, useCreateComment } from '@/hooks/comment'
import { Fragment, useEffect, useState } from 'react'
import { CommentCardProps } from '@/lib/types'

export type AddedComment = {
  newComment: CommentCardProps['comment']
  replyId: string
}

export type CreateCommentMutate = ReturnType<typeof useCreateComment>['mutate']

export const CommentDisplay = ({ postId }: { postId: string }) => {
  const user = useCurrentUser()
  const { data, fetchStatus, isSuccess, refetch } = useComments(postId)
  const [addedComments, setAddedComments] = useState<AddedComment[] | []>([])
  const { mutate } = useCreateComment()

  useEffect(() => {
    refetch()
  }, [postId, refetch])
  if (!user) return null
  return (
    <div className="flex flex-col gap-y-4 px-6 py-4 border rounded-lg">
      <CommentForm
        postId={postId}
        parentId={undefined}
        repliesToUserId={undefined}
        setAddedComments={setAddedComments}
        mutate={mutate}
      />
      <div className="max-h-[400px] overflow-y-auto">
        {addedComments.map((addedComment) => (
          <CommentCard
            key={addedComment.newComment.id}
            comment={addedComment.newComment}
            mutate={mutate}
          />
        ))}
        {isSuccess &&
          data.map((comment) => (
            <Fragment key={comment.id}>
              <CommentCard comment={comment} mutate={mutate} />
              <div className="pl-12 w-full">
                {comment.children.map((nestedComment) => (
                  <CommentCard
                    key={nestedComment.id}
                    comment={nestedComment}
                    mutate={mutate}
                  />
                ))}
              </div>
            </Fragment>
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

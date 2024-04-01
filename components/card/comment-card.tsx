import { CommentCardProps } from '@/lib/types'
import { CommentCardWrapper } from './comment-card-wrapper'
import { CreateCommentSchema } from '@/schemas'
import { z } from 'zod'

export const CommentCard = ({
  comment,
  mutate,
}: {
  comment: CommentCardProps
  mutate: (data: z.infer<typeof CreateCommentSchema>) => void
}) => {
  return (
    <CommentCardWrapper comment={comment} mutate={mutate}>
      {comment.content}
    </CommentCardWrapper>
  )
}

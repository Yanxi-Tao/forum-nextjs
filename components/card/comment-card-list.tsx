import { CommentsDataProps } from '@/lib/types'
import { CommentCard } from './comment-card'

export const CommentCardList = ({
  comments,
  offset,
  postId,
}: {
  comments: CommentsDataProps['comments']
  offset: number
  postId: string
}) => {
  return (
    <div className="flex flex-col">
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </div>
  )
}

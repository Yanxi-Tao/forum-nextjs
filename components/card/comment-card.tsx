import { CommentCardProps, NestedCommentCardProps } from '@/lib/types'
import { CommentCardWrapper, NestedCommentCardWrapper } from '@/components/card/comment-card-wrapper'
import { CreateCommentSchema } from '@/schemas'
import { z } from 'zod'
import { ExtendedUser } from '@/auth'

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

export const NestedCommentCard = ({
  postId,
  parentId,
  comment,
  mutate,
}: {
  postId: string
  parentId: string
  comment: NestedCommentCardProps
  mutate: (data: z.infer<typeof CreateCommentSchema>) => void
}) => {
  return (
    <NestedCommentCardWrapper comment={comment} mutate={mutate} parentId={parentId} postId={postId}>
      {comment.content}
    </NestedCommentCardWrapper>
  )
}

export const optimisticComment = (comment: z.infer<typeof CreateCommentSchema>, user: ExtendedUser): CommentCardProps => {
  return {
    id: 'temp-comment-id',
    content: comment.content,
    authorId: user.id as string,
    createdAt: new Date(),
    updatedAt: new Date(),
    upVotes: [],
    postId: comment.postId as string,
    parentId: null,
    repliesToId: null,
    author: {
      id: user.id as string,
      name: user.name as string,
      email: user.email as string,
      slug: user.slug,
      emailVerified: null,
      image: user.image ? user.image : null,
      password: null,
    },
    repliesTo: null,
    _count: { children: 0 },
  }
}

export const optimisticNestedComment = (comment: z.infer<typeof CreateCommentSchema>, user: ExtendedUser): NestedCommentCardProps => {
  return {
    id: 'temp-nested-comment-id',
    content: comment.content,
    authorId: user.id as string,
    createdAt: new Date(),
    updatedAt: new Date(),
    upVotes: [],
    postId: null,
    parentId: comment.parentId as string,
    repliesToId: comment.repliesToId as string,
    author: {
      id: user.id as string,
      name: user.name as string,
      email: user.email as string,
      slug: user.slug,
      emailVerified: null,
      image: user.image ? user.image : null,
      password: null,
    },
    repliesTo: comment.repliesToId
      ? {
          id: comment.repliesToId as string,
          name: comment.repliesToName as string,
          email: '',
          slug: comment.repliesToSlug as string,
          emailVerified: null,
          image: null,
          password: null,
        }
      : null,
  }
}

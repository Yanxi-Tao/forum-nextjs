import { CommentCardProps, NestedCommentCardProps } from '@/lib/types'
import {
  CommentCardWrapper,
  NestedCommentCardWrapper,
} from './comment-card-wrapper'
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
  parentId,
  comment,
  mutate,
}: {
  parentId: string
  comment: NestedCommentCardProps
  mutate: (data: z.infer<typeof CreateCommentSchema>) => void
}) => {
  return (
    <NestedCommentCardWrapper
      comment={comment}
      mutate={mutate}
      parentId={parentId}
    >
      {comment.content}
    </NestedCommentCardWrapper>
  )
}

export const optimisticComment = (
  comment: z.infer<typeof CreateCommentSchema>,
  user: ExtendedUser
) => {
  return {
    id: 'temp-comment-id',
    content: comment.content,
    authorId: user.id as string,
    createdAt: new Date(),
    updatedAt: new Date(),
    votes: 0,
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

export const optimisticNestedComment = (
  comment: z.infer<typeof CreateCommentSchema>,
  user: ExtendedUser
) => {
  return {
    id: 'temp-nested-comment-id',
    content: comment.content,
    authorId: user.id as string,
    createdAt: new Date(),
    updatedAt: new Date(),
    votes: 0,
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
    repliesTo: null,
    // repliesTo: {
    //   id: comment.repliesToId as string,
    //   name: repliesTo?.name as string,
    //   email: repliesTo?.email as string,
    //   slug: repliesTo?.slug as string,
    //   emailVerified: null,
    //   image: repliesTo?.image ? repliesTo.image : null,
    //   password: null,
    // },
  }
}

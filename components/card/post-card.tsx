import { PostCardProps } from '@/lib/types'
import { PostCardWrapper } from './post-card-wrapper'
import { ExtendedUser } from '@/auth'
import { PostType } from '@prisma/client'

export const PostCard = (post: PostCardProps) => {
  return <PostCardWrapper {...post}>{post.content}</PostCardWrapper>
}

export const optimisticAnswer = (user: ExtendedUser, title: string, content: string): PostCardProps => {
  return {
    community: null,
    author: {
      id: user.id as string,
      name: user.name as string,
      slug: user.slug,
      email: user.email as string,
      emailVerified: null,
      image: null,
      password: null,
    },
    comments: [],
    _count: { children: 0 },
    id: 'temp-id',
    title,
    content,
    type: PostType.answer,
    authorId: user.id as string,
    createdAt: new Date(),
    updatedAt: new Date(),
    votes: 0,
    views: 0,
    bookmarks: 0,
    parentId: null,
    communityId: null,
  }
}

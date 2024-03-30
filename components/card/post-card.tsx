import { PostCardProps } from '@/lib/types'
import { PostCardWrapper } from './post-card-wrapper'

export const PostCard = (post: PostCardProps) => {
  return <PostCardWrapper {...post}>{post.content}</PostCardWrapper>
}

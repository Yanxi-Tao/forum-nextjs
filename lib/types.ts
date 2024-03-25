import { Comment, Community, Post, PostType } from '@prisma/client'

export type FeedCardProps = Post & {
  commentsCount: number
  communitySlug: string | undefined
  communityName: string | undefined
  authorName: string
  authorSlug: string
}

export type CommunityCardProps = Community & {
  postsCount: number
  membersCount: number
}

export type CommentCardProps = Comment

export type CreatePostType = Exclude<PostType, 'ANSWER'>

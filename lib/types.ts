import { Comment, Community, Post } from '@prisma/client'

export type FeedCardProps = Post & {
  commentsCount: number
  communitySlug: string | null
  communityName: string | null
  authorName: string
  authorSlug: string
}

export type CommunityCardProps = Community & {
  postsCount: number
  membersCount: number
}

export type CommentCardProps = Comment

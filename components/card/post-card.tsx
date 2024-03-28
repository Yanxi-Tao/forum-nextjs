import { forwardRef } from 'react'
import { FeedCardWrapper } from './feed-card-wrapper'
import { PostCardProps } from '@/lib/types'

export const PostCard = forwardRef<HTMLDivElement, PostCardProps>(
  ({ slug, community, author, title, type, votes, _count, preview }, ref) => {
    if (!author.slug) {
      return null
    }
    const counts = type === 'QUESTION' ? _count.answers : _count.comments
    const shouldCollapse = preview.length > 200

    return (
      <FeedCardWrapper
        title={title}
        slug={slug}
        shouldCollapse={shouldCollapse}
        communityName={community?.name}
        authorName={author.name}
        authorSlug={author.slug}
        votes={votes}
        counts={counts}
        type={type}
        ref={ref}
      >
        {preview}
      </FeedCardWrapper>
    )
  }
)

PostCard.displayName = 'PostCard'

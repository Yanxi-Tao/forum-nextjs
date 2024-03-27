import { PostCardWrapper } from './post-card-wrapper'
import { PostCardProps } from '@/lib/types'

export const PostCard = ({
  slug,
  community,
  author,
  title,
  type,
  votes,
  _count,
  preview,
}: PostCardProps) => {
  if (!author.slug) {
    return null
  }
  const counts = type === 'QUESTION' ? _count.answers : _count.comments
  const shouldCollapse = preview.length > 200

  return (
    <PostCardWrapper
      title={title}
      slug={slug}
      shouldCollapse={shouldCollapse}
      communityName={community?.name}
      authorName={author.name}
      authorSlug={author.slug}
      votes={votes}
      counts={counts}
      type={type}
    >
      {preview}
    </PostCardWrapper>
  )
}

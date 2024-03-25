import { fetchPost } from '@/actions/post'
import { PostCard } from '@/components/card/feed-card'

export default async function Home() {
  const posts = await fetchPost()
  if (!posts) {
    return <div>Failed to fetch posts</div>
  }
  return (
    <>
      <div className="flex flex-col items-center space-y-6">
        {posts.map((rawPost) => {
          const post = {
            ...rawPost,
            commentsCount: rawPost._count.comments,
            communityName: rawPost.community?.name,
            communitySlug: rawPost.community?.slug,
            authorName: rawPost.author.name,
            authorSlug: rawPost.author.slug,
            communityId: rawPost.communityId,
          }
          return <PostCard key={post.id} post={post} />
        })}
      </div>
    </>
  )
}

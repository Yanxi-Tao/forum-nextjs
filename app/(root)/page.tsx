import { fetchPosts } from '@/actions/post/fetch-post'
import { PostCard } from '@/components/card/post-card'

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { search: string | undefined }
}) {
  const search = searchParams?.search
  const { posts, cursor } = await fetchPosts(search, undefined, undefined, 10)
  return (
    <div>
      <h1>Home</h1>
      {posts.map((post) => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  )
}

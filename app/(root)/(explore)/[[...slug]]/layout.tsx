import { fetchPosts } from '@/actions/post/fetch-post'
import { PostCardList } from '@/components/card/post-card-list'
import { POST_FETCH_SPAN } from '@/lib/constants'

export default async function ExploreLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: { slug: string | string[] }
}>) {
  const data = await fetchPosts(undefined, undefined, 0, POST_FETCH_SPAN)
  return <PostCardList data={data} />
}

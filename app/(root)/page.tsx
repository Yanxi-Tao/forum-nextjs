import { fetchPosts } from '@/actions/post/fetch-post'
import { PostCardList } from '@/components/card/post-card-list'
import { POST_FETCH_SPAN } from '@/lib/constants'

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { search: string | undefined }
}) {
  const search = searchParams?.search
  const data = await fetchPosts(search, undefined, 0, POST_FETCH_SPAN)
  return <PostCardList data={data} />
}

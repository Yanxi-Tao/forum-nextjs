import { fetchPostById } from '@/actions/post/fetch-post'
import ArticleDisplay from '@/components/display/article-display'

export default async function ArticleCommunityDisplayPage({
  params,
}: {
  params: { slug: string[] }
}) {
  const post = await fetchPostById(params.slug[0])
  if (!post) return null
  return <ArticleDisplay post={post} />
}

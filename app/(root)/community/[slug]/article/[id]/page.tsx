import { fetchPostById } from '@/actions/post/fetch-post'
import ArticleDisplay from '@/components/display/article-display'

export default async function ArticleCommunityDisplayPage({ params }: { params: { id: string } }) {
  const post = await fetchPostById(params.id)
  if (!post) return null

  return <ArticleDisplay {...post} />
}

import { fetchPostById } from '@/actions/post/fetch-post'
import ArticleDisplay from '@/components/display/article-display'

export default async function ArticleDisplayPage({
  params,
}: {
  params: { id: string[] }
}) {
  const post = await fetchPostById(params.id[0])
  if (!post) return null
  const mode = params.id?.[1] === 'edit' ? 'edit' : 'display'

  return <ArticleDisplay {...post} mode={mode} />
}

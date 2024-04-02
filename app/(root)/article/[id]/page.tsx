import { fetchPostById } from '@/actions/post/fetch-post'
import ArticleDisplay from '@/components/display/article-display'

import QuestionDisplay from '@/components/display/question-display'

export default async function ArticleDisplayPage({ params }: { params: { id: string } }) {
  const post = await fetchPostById(params.id)
  if (!post) return null

  return <ArticleDisplay {...post} />
}

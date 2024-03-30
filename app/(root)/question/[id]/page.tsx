import { fetchPostById } from '@/actions/post/fetch-post'

import QuestionDisplay from '@/components/display/question-display'

export default async function QuestionDisplayPage({
  params,
}: {
  params: { id: string }
}) {
  const post = await fetchPostById(params.id)
  if (!post) return null
  return <QuestionDisplay {...post} />
}

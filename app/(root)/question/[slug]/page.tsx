import { fetchAnswers, fetchPost } from '@/actions/post/fetch-post'
import { QuesionDisplay } from '@/components/display/question-display'
import { ANSWERS_FETCH_SPAN } from '@/lib/constants'

export default async function QuestionPage({
  params,
}: {
  params: { slug: string }
}) {
  const question = await fetchPost(params.slug)
  const answers = await fetchAnswers(params.slug, 0, ANSWERS_FETCH_SPAN)
  console.log(question, answers)

  if (!question) return <div>Question not found</div>

  return <QuesionDisplay question={question} answers={answers} />
}

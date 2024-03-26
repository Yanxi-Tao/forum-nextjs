import { fetchQuestionInitial } from '@/actions/post'
import { QuestionDisplay } from '@/components/display/question-display'
import { ANSWERS_FETCH_SPAN } from '@/constants'

export default async function QuestionPage({
  params,
}: {
  params: { questionSlug: string }
}) {
  const { question, initialAnswers, myCursor } = await fetchQuestionInitial(
    params.questionSlug,
    ANSWERS_FETCH_SPAN
  )
  if (!question) {
    return <div>Question not found</div>
  }

  return (
    <QuestionDisplay
      question={question}
      initialAnswers={initialAnswers}
      myCursor={myCursor}
    />
  )
}

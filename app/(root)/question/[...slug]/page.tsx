import {
  fetchAnswer,
  fetchAnswers,
  fetchPostById,
} from '@/actions/post/fetch-post'

import QuestionDisplay from '@/components/display/question-display'
import { currentUser } from '@/lib/auth'
import {
  ANSWERS_FETCH_SPAN,
  MY_ANSWER_KEY,
  QUESTION_ANSWERS_KEY,
  REDIRECT_ANSWER_KEY,
} from '@/lib/constants'
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query'
import { Suspense } from 'react'
import PulseLoader from 'react-spinners/PulseLoader'

export default async function QuestionDisplayPage({
  params,
}: {
  params: { slug: string[] }
}) {
  const [questionId, _, answerId] = params.slug
  const post = await fetchPostById(questionId)
  const user = await currentUser()
  if (!post || !user) return null

  const queryClient = new QueryClient()
  await queryClient.prefetchInfiniteQuery({
    queryKey: [QUESTION_ANSWERS_KEY],
    queryFn: ({ pageParam }) => fetchAnswers(pageParam),
    initialPageParam: {
      parentId: questionId,
      offset: 0,
      take: ANSWERS_FETCH_SPAN,
    },
    staleTime: Infinity,
  })
  await queryClient.prefetchQuery({
    queryKey: [MY_ANSWER_KEY],
    queryFn: () => fetchAnswer(user.id, questionId),
    staleTime: Infinity,
  })
  if (answerId) {
    await queryClient.prefetchQuery({
      queryKey: [REDIRECT_ANSWER_KEY],
      queryFn: () => fetchPostById(answerId),
      staleTime: Infinity,
    })
  }

  return (
    <Suspense
      fallback={
        <div className="flex justify-center my-10">
          <PulseLoader color="#8585ad" />
        </div>
      }
    >
      <HydrationBoundary state={dehydrate(queryClient)}>
        <QuestionDisplay post={post} redirectAnswerId={answerId} />
      </HydrationBoundary>
    </Suspense>
  )
}

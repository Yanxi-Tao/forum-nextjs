import { fetchAnswers, fetchPostById } from '@/actions/post/fetch-post'

import QuestionDisplay from '@/components/display/question-display'
import { ANSWERS_FETCH_SPAN } from '@/lib/constants'
import { FetchAnswerQueryKey } from '@/lib/types'
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query'

export default async function QuestionDisplayPage({
  params,
}: {
  params: { id: string }
}) {
  const post = await fetchPostById(params.id)
  if (!post) return null
  const queryClient = new QueryClient()

  const queryKey: FetchAnswerQueryKey = [
    'question-answers',
    {
      parentId: params.id,
      offset: 0,
      take: ANSWERS_FETCH_SPAN,
    },
  ]
  await queryClient.prefetchInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => fetchAnswers(pageParam),
    initialPageParam: { queryKey },
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QuestionDisplay {...post} />
    </HydrationBoundary>
  )
}

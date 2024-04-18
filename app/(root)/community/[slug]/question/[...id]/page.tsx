import { fetchAnswers, fetchPostById } from '@/actions/post/fetch-post'

import QuestionDisplay from '@/components/display/question-display'
import { ANSWERS_FETCH_SPAN, QUESTION_ANSWERS_KEY } from '@/lib/constants'
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query'

export default async function QuestionCommunityDisplayPage({
  params,
}: {
  params: { id: string[] }
}) {
  const post = await fetchPostById(params.id[0])
  if (!post) return null

  const queryClient = new QueryClient()
  await queryClient.prefetchInfiniteQuery({
    queryKey: [QUESTION_ANSWERS_KEY],
    queryFn: ({ pageParam }) => fetchAnswers(pageParam),
    initialPageParam: {
      parentId: params.id[0],
      offset: 0,
      take: ANSWERS_FETCH_SPAN,
    },
  })

  const mode = params.id?.[1] === 'edit' ? 'edit' : 'display'
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QuestionDisplay {...post} mode={mode} />
    </HydrationBoundary>
  )
}

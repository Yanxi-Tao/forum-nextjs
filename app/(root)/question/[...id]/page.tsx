import {
  fetchAnswer,
  fetchAnswers,
  fetchPostById,
} from '@/actions/post/fetch-post'

import QuestionDisplay from '@/components/display/question-display'
import { currentUser } from '@/lib/auth'
import {
  ANSWERS_FETCH_SPAN,
  CURRENT_POST_KEY,
  MY_ANSWER_KEY,
  QUESTION_ANSWERS_KEY,
} from '@/lib/constants'
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query'
import { redirect } from 'next/navigation'

export default async function QuestionDisplayPage({
  params,
}: {
  params: { id: string[] }
}) {
  const post = await fetchPostById(params.id[0])
  const user = await currentUser()
  if (!post || !user) return null
  const myAnswer = await fetchAnswer(user.id, params.id[0])

  const queryClient = new QueryClient()
  await queryClient.prefetchInfiniteQuery({
    queryKey: [QUESTION_ANSWERS_KEY],
    queryFn: ({ pageParam }) => fetchAnswers(pageParam),
    initialPageParam: {
      parentId: params.id[0],
      offset: 0,
      take: ANSWERS_FETCH_SPAN,
    },
    gcTime: Infinity,
    staleTime: Infinity,
  })
  await queryClient.prefetchQuery({
    queryKey: [MY_ANSWER_KEY],
    queryFn: () => fetchAnswer(user.id, params.id[0]),
    gcTime: Infinity,
    staleTime: Infinity,
  })

  const mode = params.id?.[1] === 'edit' ? 'edit' : 'display'
  if (mode === 'edit' && user.id !== post.author?.id)
    return redirect(`/question/${params.id[0]}`)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QuestionDisplay post={post} myAnswer={myAnswer} mode={mode} />
    </HydrationBoundary>
  )
}

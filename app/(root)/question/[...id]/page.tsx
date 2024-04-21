import { fetchAnswers, fetchPostById } from '@/actions/post/fetch-post'

import QuestionDisplay from '@/components/display/question-display'
import { currentUser } from '@/lib/auth'
import { ANSWERS_FETCH_SPAN, QUESTION_ANSWERS_KEY } from '@/lib/constants'
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
    gcTime: Infinity,
    staleTime: Infinity,
  })
  const mode = params.id?.[1] === 'edit' ? 'edit' : 'display'
  if (mode === 'edit' && user?.id !== post.author?.id)
    return redirect(`/question/${params.id[0]}`)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QuestionDisplay {...post} mode={mode} />
    </HydrationBoundary>
  )
}

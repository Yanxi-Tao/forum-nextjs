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

export default async function QuestionCommunityDisplayPage({
  params,
}: {
  params: { slug: string; id: string[] }
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
  })
  const mode = params.id?.[1] === 'edit' ? 'edit' : 'display'
  if (mode === 'edit' && user?.id !== post.author?.id)
    return redirect(`/community/${params.slug}/question/${params.id[0]}`)
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QuestionDisplay {...post} mode={mode} />
    </HydrationBoundary>
  )
}

import { fetchPostById } from '@/actions/post/fetch-post'
import ArticleDisplay from '@/components/display/article-display'
import { Suspense } from 'react'
import PulseLoader from 'react-spinners/PulseLoader'

export default async function ArticleDisplayPage({
  params,
}: {
  params: { slug: string[] }
}) {
  const post = await fetchPostById(params.slug[0])
  if (!post) return <div>Not logged in</div>

  return (
    <Suspense
      fallback={
        <div className="flex justify-center my-10">
          <PulseLoader color="#8585ad" />
        </div>
      }
    >
      <ArticleDisplay post={post} />
    </Suspense>
  )
}

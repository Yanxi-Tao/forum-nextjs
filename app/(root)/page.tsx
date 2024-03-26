import { fetchPostsInitial } from '@/actions/post'
import { ExploreDisplay } from '@/components/display/explore-display'
import { POST_FETCH_SPAN } from '@/constants'

export default async function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined }
}) {
  const { initialPosts, myCursor } = await fetchPostsInitial(
    searchParams?.search,
    POST_FETCH_SPAN
  )
  if (!initialPosts) {
    return <div>Posts not found</div>
  }

  return (
    <ExploreDisplay
      searchParams={searchParams}
      initialPosts={initialPosts}
      myCursor={myCursor}
    />
  )
}

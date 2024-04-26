import { CreatePostDisplay } from '@/components/display/create-display'
import { getCommunityBySlug } from '@/data/community'
import { Suspense } from 'react'
import PulseLoader from 'react-spinners/PulseLoader'
export default async function CreateCommunityPostPage({
  params: { cslug },
}: {
  params: { cslug: string }
}) {
  const communityName = await getCommunityBySlug(cslug)
  if (!communityName) return <div>Community does not exist</div>
  return (
    <Suspense
      fallback={
        <div className="flex justify-center my-10">
          <PulseLoader color="#8585ad" />
        </div>
      }
    >
      <CreatePostDisplay
        communityName={communityName.name}
        communitySlug={cslug}
      />
    </Suspense>
  )
}

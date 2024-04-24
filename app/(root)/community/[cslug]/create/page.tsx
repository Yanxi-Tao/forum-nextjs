import { CreatePostDisplay } from '@/components/display/create-display'
import { getCommunityBySlug } from '@/data/community'
export default async function CreateCommunityPostPage({
  params: { cslug },
}: {
  params: { cslug: string }
}) {
  const communityName = await getCommunityBySlug(cslug)
  if (!communityName) return <div>Community does not exist</div>
  return (
    <CreatePostDisplay
      communityName={communityName.name}
      communitySlug={cslug}
    />
  )
}

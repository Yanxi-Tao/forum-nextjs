import { CreatePostDisplay } from '@/components/display/create-display'
import { getCommunityBySlug } from '@/data/community'
export default async function CreateCommunityPostPage({ params: { slug } }: { params: { slug: string } }) {
  const communityName = await getCommunityBySlug(slug)
  if (!communityName) return <div>Community does not exist</div>
  return <CreatePostDisplay communityName={communityName.name} communitySlug={slug} />
}

import { CommunityUpdateForm } from '@/components/form/community-form'
import { getCommunityBySlug } from '@/data/community'

export default async function CommunityEditPage({
  params: { slug },
}: {
  params: { slug: string }
}) {
  const community = await getCommunityBySlug(slug)
  if (!community) return null
  return <CommunityUpdateForm community={community} />
}

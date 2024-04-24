import { CommunityUpdateForm } from '@/components/form/community-form'
import { getCommunityBySlug } from '@/data/community'

export default async function CommunityEditPage({
  params: { cslug },
}: {
  params: { cslug: string }
}) {
  const community = await getCommunityBySlug(cslug)
  if (!community) return null
  return <CommunityUpdateForm community={community} />
}

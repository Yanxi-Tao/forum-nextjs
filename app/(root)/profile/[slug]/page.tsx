import { fetchProfile } from '@/actions/profile/fetch-profile'
import { ProfileDisplay } from '@/components/display/profile-display'

export default async function ProfilePage({
  params: { slug },
}: {
  params: { slug: string }
}) {
  const profile = await fetchProfile(slug)
  if (!profile) return <div>Profile not found</div>
  return <ProfileDisplay profile={profile} />
}

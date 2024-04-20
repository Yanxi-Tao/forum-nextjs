import { fetchProfile } from '@/actions/profile/fetch-profile'
import { currentUser } from '@/lib/auth'
import { ProfileDisplay } from '@/components/display/profile-display'

export default async function ProfilePage() {
  const user = await currentUser()
  if (!user) {
    return <div>Not logged in</div>
  }

  const profile = await fetchProfile(user.slug)
  if (!profile) {
    return <div>Profile not found</div>
  }
  return <ProfileDisplay profile={profile} />
}

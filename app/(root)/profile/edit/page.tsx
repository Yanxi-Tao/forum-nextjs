import { fetchEditProfile } from '@/actions/profile/fetch-profile'
import { ProfileForm } from '@/components/form/profile-update-form'
import { currentUser } from '@/lib/auth'

export default async function ProfileEditPage() {
  const user = await currentUser()
  if (!user) {
    return <div>Not logged in</div>
  }
  const profile = (await fetchEditProfile(user.id))?.profile

  if (!profile) {
    return <div>Profile not found</div>
  }
  return <ProfileForm profile={profile} />
}

import { fetchEditProfile } from '@/actions/profile/fetch-profile'
import { ProfileForm } from '@/components/form/profile-form'
import { currentUser } from '@/lib/auth'

export default async function ProfileEditPage() {
  const user = await currentUser()
  if (!user) {
    return <div>Not logged in</div>
  }
  const editProfile = await fetchEditProfile(user.id)

  if (!editProfile || !editProfile.profile) {
    return <div>Profile not found</div>
  }

  //   return <div>Profile Edit</div>

  return <ProfileForm editProfile={editProfile} />
}

import { fetchProfile } from '@/actions/profile/fetch-profile'
import { currentUser } from '@/lib/auth'
import { ProfileDisplay } from '@/components/display/profile-display'
import { Suspense } from 'react'
import PulseLoader from 'react-spinners/PulseLoader'

export default async function ProfilePage() {
  const user = await currentUser()
  if (!user) return <div>Not logged in</div>

  const profile = await fetchProfile(user.slug)
  if (!profile) return <div>Profile not found</div>
  return (
    <Suspense
      fallback={
        <div className="flex justify-center my-10">
          <PulseLoader color="#8585ad" />
        </div>
      }
    >
      <ProfileDisplay profile={profile} />
    </Suspense>
  )
}

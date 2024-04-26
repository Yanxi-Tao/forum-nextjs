import { CreatePostDisplay } from '@/components/display/create-display'
import { currentUser } from '@/lib/auth'
import { Suspense } from 'react'
import PulseLoader from 'react-spinners/PulseLoader'
export default function CreateDefaultPostPage() {
  const user = currentUser()
  if (!user) return <div>Not logged in</div>
  return (
    <Suspense
      fallback={
        <div className="flex justify-center my-10">
          <PulseLoader color="#8585ad" />
        </div>
      }
    >
      <CreatePostDisplay communityName="General" />
    </Suspense>
  )
}

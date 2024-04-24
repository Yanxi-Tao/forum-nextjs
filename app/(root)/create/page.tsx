import { CreatePostDisplay } from '@/components/display/create-display'
import { currentUser } from '@/lib/auth'
export default function CreateDefaultPostPage() {
  const user = currentUser()
  if (!user) return <div>Not logged in</div>
  return <CreatePostDisplay communityName="General" />
}

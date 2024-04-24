import { CommunityCreateForm } from '@/components/form/community-form'
import { currentUser } from '@/lib/auth'

export default function CreateCommunitiesPage() {
  const user = currentUser()
  if (!user) return <div>Not logged in</div>
  return <CommunityCreateForm />
}

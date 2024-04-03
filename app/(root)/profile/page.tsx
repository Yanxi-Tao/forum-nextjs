import { currentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function ProfileRedirect() {
  const user = await currentUser()
  return redirect(`/profile/${user?.slug}`)
}

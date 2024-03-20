import { auth, signOut } from '@/auth'

export default async function PrivatePage() {
  const session = await auth()
  return (
    <div>
      {JSON.stringify(session)}
      <form
        action={async () => {
          'use server'
          await signOut()
        }}
      >
        <button type="submit">sign out</button>
      </form>
    </div>
  )
}

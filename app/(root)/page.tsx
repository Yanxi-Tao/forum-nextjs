'use client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  return (
    <main className="flex h-screen justify-center items-center flex-col gap-4">
      <div className="space-y-6">
        <h1 className="text-6xl font-semibold">Auth</h1>
      </div>
      <p>Authentication Service</p>
      <div>
        <Button
          size="lg"
          onClick={() => {
            router.push('/auth/login')
          }}
        >
          Sign in
        </Button>
      </div>
    </main>
  )
}

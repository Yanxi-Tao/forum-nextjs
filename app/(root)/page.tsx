'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  return (
    <>
      <div className="flex justify-center space-y-6">
        <h1 className="text-6xl font-semibold">FEEDS</h1>
      </div>
    </>
  )
}

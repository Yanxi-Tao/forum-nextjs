'use client'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  return (
    <>
      <div className="space-y-6">
        <h1 className="text-6xl font-semibold">FEEDS</h1>
      </div>
    </>
  )
}

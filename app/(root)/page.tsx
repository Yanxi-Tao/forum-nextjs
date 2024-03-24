'use client'

import { FeedCard } from '@/components/card/feed-card'
import { useRouter } from 'next/navigation'
import { feedCardTestData } from '@/testData'

export default function Home() {
  const router = useRouter()
  return (
    <>
      <div className="flex flex-col items-center space-y-6">
        {[...Array(10)].map((_, i) => (
          <FeedCard key={i} post={feedCardTestData()} />
        ))}
      </div>
    </>
  )
}

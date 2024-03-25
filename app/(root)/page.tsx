'use client'

import { PostCard } from '@/components/card/feed-card'
import { useRouter } from 'next/navigation'
import { commentCardTestData, feedCardTestData } from '@/testData'
import { CommentCard } from '@/components/card/comment-card'

export default function Home() {
  const router = useRouter()
  return (
    <>
      <div className="flex flex-col items-center space-y-6">
        <CommentCard comment={commentCardTestData()} />
        {[...Array(10)].map((_, i) => (
          <PostCard key={i} post={feedCardTestData()} />
        ))}
      </div>
    </>
  )
}

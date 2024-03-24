'use client'

import { FeedCard } from '@/components/card/feed-card'
import { Post, PostType } from '@prisma/client'
import { useRouter } from 'next/navigation'

const testData: Post = {
  id: 'postId',
  title: "What's the most underrated hobby you've ever tried?",
  preview: `Hey fellow Redditors! Let's have a little chat about hobbies that don't get the love they deserve. We all know about the mainstream ones like gaming, hiking, or painting, but what about those hidden gems that you stumbled upon and instantly fell in love with?
  I'll start things off: For me...`,
  type: PostType.ANSWER,
  questionId: 'questionID',
  createdAt: new Date(),
  updatedAt: new Date(),
  authorId: 'authorId',
  content: '',
  votes: 123,
  views: 12343,
  bookmarked: 234,
  commentsCount: 456,
  communityId: 'communityId',
}

export default function Home() {
  const router = useRouter()
  return (
    <>
      <div className="flex flex-col items-center px-20 space-y-6">
        <FeedCard post={testData} />
        <FeedCard post={testData} />
        <FeedCard post={testData} />
        <FeedCard post={testData} />
        <FeedCard post={testData} />
        <FeedCard post={testData} />
        <FeedCard post={testData} />
        <FeedCard post={testData} />
        <FeedCard post={testData} />
        <FeedCard post={testData} />
        <FeedCard post={testData} />
        <FeedCard post={testData} />
        <FeedCard post={testData} />
      </div>
    </>
  )
}

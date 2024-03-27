'use client'

import { PostDataProps } from '@/lib/types'
import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { PostCard } from './post-card'
import { useSearchParams } from 'next/navigation'

export const PostCardList = ({
  data: initialData,
}: {
  data: PostDataProps
}) => {
  const searchParams = useSearchParams()
  const search = searchParams.get('search') || undefined
  const communityName = searchParams.get('community') || undefined
  const { ref, inView } = useInView()

  return (
    <div>
      <h1>Home</h1>
      {initialData.posts.map((post) => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  )
}

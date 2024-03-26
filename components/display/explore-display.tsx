'use client'
import { ExploreDisplayType } from '@/lib/types'
import { useCallback, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { PostCard } from '../card/feed-card'
import { fetchMorePosts } from '@/actions/post'
import { POST_FETCH_SPAN } from '@/constants'

export const ExploreDisplay = ({
  searchParams,
  initialPosts,
  myCursor,
}: ExploreDisplayType) => {
  const [posts, setPosts] = useState(initialPosts)
  const [cursor, setCursor] = useState(myCursor)
  const { ref, inView } = useInView()

  const loadMorePosts = useCallback(async () => {
    if (!cursor) {
      return
    }
    const { newPosts, myCursor } = await fetchMorePosts(
      searchParams?.search,
      POST_FETCH_SPAN,
      cursor
    )
    setPosts([...posts, ...(newPosts || [])])
    setCursor(myCursor)
  }, [cursor, posts, searchParams?.search])

  useEffect(() => {
    if (inView) {
      loadMorePosts()
    }
  }, [inView, loadMorePosts])

  return (
    <div className="flex flex-col space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      <div ref={ref} className="h-10" />
    </div>
  )
}

'use client'

import { PostsDataProps } from '@/lib/types'
import { useCallback, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { PostCard } from './post-card'
import { useSearchParams } from 'next/navigation'
import { fetchPosts } from '@/actions/post/fetch-post'
import { POST_FETCH_SPAN } from '@/lib/constants'
import { BeatLoader } from 'react-spinners'

export const PostCardList = ({
  data: initialData,
}: {
  data: PostsDataProps
}) => {
  const searchParams = useSearchParams()
  const search = searchParams.get('search') || undefined
  const communityName = searchParams.get('community') || undefined
  const [posts, setPosts] = useState(initialData.posts)
  const [offset, setOffset] = useState(initialData.offset)
  const [hasNextPage, setHasNextPage] = useState(true)

  const fetchMorePosts = useCallback(async () => {
    const data = await fetchPosts(
      search,
      communityName,
      offset,
      POST_FETCH_SPAN
    )
    if (!data.posts.length) {
      setHasNextPage(false)
      return
    }
    setPosts([...posts, ...data.posts])
    setOffset(data.offset)
  }, [search, communityName, offset, posts])

  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchMorePosts()
    }
  }, [inView, fetchMorePosts, hasNextPage])

  return (
    <div className="flex flex-col space-y-4">
      {posts.map((post, index) => {
        if (index === posts.length - 1) {
          return <PostCard key={post.id} ref={ref} {...post} />
        } else {
          return <PostCard key={post.id} {...post} />
        }
      })}
      {inView && hasNextPage && (
        <div className="flex justify-center items-center h-32">
          <BeatLoader />
        </div>
      )}
      {!hasNextPage && (
        <div className="flex justify-center items-center h-24">
          No more posts
        </div>
      )}
    </div>
  )
}

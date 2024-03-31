'use client'

import { useInView } from 'react-intersection-observer'
import { PostCard } from '@/components/card/post-card'
import { useEffect } from 'react'
import { usePostsInfiniteQuery } from '@/hooks/post/usePostsInfiniteQuery'
import { useSearchParams } from 'next/navigation'

export const ExploreDisplay = () => {
  const searchParams = useSearchParams()
  const search = searchParams.get('search') || undefined
  const { ref, inView } = useInView()
  const { data, isSuccess, hasNextPage, fetchNextPage } =
    usePostsInfiniteQuery(search)

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  return (
    <div className="flex flex-col space-y-3">
      {isSuccess &&
        data.pages.map((page) =>
          page.posts.map((post) => {
            if (page.posts.indexOf(post) === page.posts.length - 1) {
              return (
                <div key={post.id} ref={ref}>
                  <PostCard {...post} />
                </div>
              )
            } else {
              return <PostCard key={post.id} {...post} />
            }
          })
        )}
    </div>
  )
}

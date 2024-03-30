'use client'

import { useInView } from 'react-intersection-observer'

import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchPost } from '@/actions/post/fetch-post'
import { FetchPostQueryKey } from '@/lib/types'
import { PostCard } from '@/components/card/post-card'
import { useEffect } from 'react'

export const ExploreDisplay = () => {
  const { ref, inView } = useInView()
  const queryKey: FetchPostQueryKey = [
    'explore',
    {
      search: undefined,
      communityName: undefined,
      offset: 0,
      take: 5,
    },
  ]
  const { data, isSuccess, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => fetchPost(pageParam),
    initialPageParam: { queryKey },
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
      if (!lastPage.nextOffset) return undefined
      lastPageParam.queryKey[1].offset = lastPage.nextOffset

      return lastPageParam
    },
    gcTime: Infinity,
    refetchIntervalInBackground: true,
  })

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

'use client'

import { SearchIcon } from 'lucide-react'
import { Input } from '../ui/input'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { COMMUNITY_FETCH_SPAN, COMMUNITY_KEY } from '@/lib/constants'
import { fetchCommunities } from '@/actions/community/fetch-community'
import { useEffect, useState } from 'react'
import { CommunityCard } from './community-card'
import { useInView } from 'react-intersection-observer'
import BeatLoader from 'react-spinners/BeatLoader'

export const CommunityCardList = () => {
  const [search, setSearch] = useState<string | undefined>(undefined)
  const { ref, inView } = useInView()
  const queryClient = useQueryClient()
  const { data, isSuccess, fetchStatus, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: [COMMUNITY_KEY, { search }],
    queryFn: ({ pageParam }) => fetchCommunities(pageParam),
    initialPageParam: {
      search,
      offset: 0,
      take: COMMUNITY_FETCH_SPAN,
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.nextOffset) return undefined
      return {
        search,
        offset: lastPage.nextOffset,
        take: COMMUNITY_FETCH_SPAN,
      }
    },
    gcTime: Infinity,
    staleTime: Infinity,
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const search = formData.get('search') as string
    setSearch(search)
    queryClient.invalidateQueries({ queryKey: [COMMUNITY_KEY] })
  }

  return (
    <div className="relative">
      <form
        className="absolute top-0 left-0 right-0 flex items-center border-b rounded-none focus-within:border-ring mx-4 h-11"
        onSubmit={handleSubmit}
      >
        <SearchIcon size={20} />
        <Input placeholder="Search" name="search" className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
      </form>
      <div className="h-11" />
      <div className="flex flex-col space-y-2 pt-2 overflow-auto h-[calc(100vh-270px)]">
        {isSuccess &&
          data.pages.map((page) =>
            page.communities.map((community) => {
              if (page.communities.indexOf(community) === page.communities.length - 1) {
                return (
                  <div key={community.id} ref={ref}>
                    <CommunityCard key={community.id} {...community} />
                  </div>
                )
              } else {
                return <CommunityCard key={community.id} {...community} />
              }
            })
          )}
        {fetchStatus === 'fetching' && (
          <div className="flex justify-center h-10 my-4">
            <BeatLoader className="h-10" />
          </div>
        )}
        {!hasNextPage && (
          <div className="flex items-center h-10 my-4 px-20">
            <div className="w-full border-b-2" />
          </div>
        )}
      </div>
    </div>
  )
}

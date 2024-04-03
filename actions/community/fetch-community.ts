'use server'

import { getDefaultCommunities, getSearchedCommunities } from '@/data/community'
import { FetchCommunityQueryKey } from '@/lib/types'
import { unstable_noStore } from 'next/cache'

export const fetchCommunities = async ({ search, offset, take }: FetchCommunityQueryKey) => {
  unstable_noStore()
  if (!search) {
    const communities = await getDefaultCommunities({
      offset,
      take,
    })
    return {
      communities,
      nextOffset: communities.length ? offset + communities.length : undefined,
    }
  } else {
    const communities = await getSearchedCommunities({
      search,
      offset,
      take,
    })
    return {
      communities,
      nextOffset: communities.length ? offset + communities.length : undefined,
    }
  }
}

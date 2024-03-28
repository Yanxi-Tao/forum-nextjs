'use server'

import { getDefaultPosts, getPostsBySearchParams } from '@/data/post'
import { unstable_cache } from 'next/cache'

export const fetchPosts = unstable_cache(
  async (
    search: string | undefined,
    communityName: string | undefined,
    offset: number,
    take: number
  ) => {
    if (search) {
      const posts = await getPostsBySearchParams(
        search,
        communityName,
        offset,
        take
      )
      return { posts, offset: offset + posts.length }
    } else {
      const posts = await getDefaultPosts(offset, take)
      return { posts, offset: offset + posts.length }
    }
  },
  ['posts'],
  {
    tags: ['posts'],
  }
)

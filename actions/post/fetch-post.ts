'use server'

import { getDefaultPosts, getPostsBySearchParams } from '@/data/post'
import { cache } from 'react'

export const fetchPosts = cache(
  async (
    search: string | undefined,
    cursor: string | undefined,
    take: number
  ) => {
    if (search) {
      return getPostsBySearchParams(search, cursor, take)
    } else {
      return getDefaultPosts(cursor, take)
    }
  }
)

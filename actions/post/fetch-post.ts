'use server'

import { getDefaultPosts, getPostsBySearchParams } from '@/data/post'

export const fetchPosts = async (
  search: string | undefined,
  communityName: string | undefined,
  offset: number | undefined,
  take: number
) => {
  if (search) {
    const posts = await getPostsBySearchParams(
      search,
      communityName,
      offset,
      take
    )
    return { posts, offset: posts.length }
  } else {
    const posts = await getDefaultPosts(offset, take)
    return { posts, offset: posts.length }
  }
}

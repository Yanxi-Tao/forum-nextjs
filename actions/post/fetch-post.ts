'use server'

import { getDefaultPosts, getPostsBySearchParams } from '@/data/post'

export const fetchPosts = async (
  search: string | undefined,
  communityName: string | undefined,
  cursor: string | undefined,
  take: number
) => {
  if (search) {
    const posts = await getPostsBySearchParams(
      search,
      communityName,
      cursor,
      take
    )
    const myCursor = posts[posts.length - 1]?.id
    return { posts, cursor: myCursor }
  } else {
    const posts = await getDefaultPosts(cursor, take)
    const myCursor = posts[posts.length - 1]?.id
    return { posts, cursor: myCursor }
  }
}

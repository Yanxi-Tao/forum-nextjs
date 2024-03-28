'use server'

import {
  getAnswersBySlug,
  getDefaultPosts,
  getPostBySlug,
  getPostsBySearchParams,
} from '@/data/post'
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

export const fetchPost = unstable_cache(
  async (slug: string) => {
    return await getPostBySlug(slug)
  },
  ['post'],
  {
    tags: ['post'],
  }
)

export const fetchAnswers = unstable_cache(
  async (slug: string, offset: number, take: number) => {
    const answers = await getAnswersBySlug(slug, offset, take)
    return { answers, offset: offset + answers.length }
  },
  ['answers'],
  {
    tags: ['answers'],
  }
)

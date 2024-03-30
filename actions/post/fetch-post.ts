'use server'

import {
  getDefaultQuestionsOrArticles,
  getSearchedQuestionsOrArticles,
} from '@/data/post'
import { FetchPostQueryKey } from '@/lib/types'
import { unstable_cache } from 'next/cache'

export const fetchPost = unstable_cache(
  async ({ queryKey }: { queryKey: FetchPostQueryKey }) => {
    const [, { search, communityName, offset, take }] = queryKey
    if (!search) {
      const posts = await getDefaultQuestionsOrArticles({
        communityName,
        offset,
        take,
      })
      return {
        posts,
        nextOffset: posts.length ? offset + posts.length : undefined,
      }
    } else {
      const posts = await getSearchedQuestionsOrArticles({
        search,
        communityName,
        offset,
        take,
      })
      return {
        posts,
        nextOffset: posts.length ? offset + posts.length : undefined,
      }
    }
  },
  ['posts'],
  {
    tags: ['posts'],
  }
)

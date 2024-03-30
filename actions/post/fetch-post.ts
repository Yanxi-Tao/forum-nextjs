'use server'

import {
  getAnsewrs,
  getDefaultQuestionsOrArticles,
  getPostById,
  getSearchedQuestionsOrArticles,
} from '@/data/post'
import { FetchAnswerQueryKey, FetchPostQueryKey } from '@/lib/types'
import { unstable_cache } from 'next/cache'

export const fetchPosts = unstable_cache(
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

export const fetchPostById = unstable_cache(
  async (id: string) => {
    return await getPostById(id)
  },
  ['post'],
  {
    tags: ['post'],
  }
)

export const fetchAnswers = unstable_cache(
  async ({ queryKey }: { queryKey: FetchAnswerQueryKey }) => {
    const [, { offset, take, parentId }] = queryKey
    const answers = await getAnsewrs({ offset, take, parentId })
    return {
      answers,
      nextOffset: answers.length ? offset + answers.length : undefined,
    }
  },
  ['answers'],
  {
    tags: ['answers'],
  }
)

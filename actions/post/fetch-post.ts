'use server'

import {
  getAnsewrs,
  getDefaultQuestionsOrArticles,
  getMyAnswerByQuestionId,
  getPostById,
  getSearchedQuestionsOrArticles,
} from '@/data/post'
import { FetchAnswerQueryKey, FetchPostQueryKey } from '@/lib/types'
import { unstable_cache, unstable_noStore } from 'next/cache'

export const fetchPosts = async ({
  search,
  communitySlug,
  offset,
  take,
}: FetchPostQueryKey) => {
  unstable_noStore()
  if (!search) {
    const posts = await getDefaultQuestionsOrArticles({
      communitySlug,
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
      communitySlug,
      offset,
      take,
    })
    return {
      posts,
      nextOffset: posts.length ? offset + posts.length : undefined,
    }
  }
}

export const fetchPostById = async (id: string | undefined) => {
  unstable_noStore()
  return await getPostById(id)
}

export const fetchAnswer = async (
  userId: string | undefined,
  questionId: string
) => {
  unstable_noStore()
  if (!userId) return
  return await getMyAnswerByQuestionId(userId, questionId)
}

export const fetchAnswers = async ({
  parentId,
  offset,
  take,
}: FetchAnswerQueryKey) => {
  unstable_noStore()
  const answers = await getAnsewrs({ offset, take, parentId })
  return {
    answers,
    nextOffset: answers.length ? offset + answers.length : undefined,
  }
}

'use server'

import { db } from '@/db/client'
import { z } from 'zod'
import { CreateAnswerScheme, CreateQuestionOrArticleSchema } from '@/schemas'
import { currentUser } from '@/lib/auth'
import { slugify } from '@/lib/slug'
import { CreatePostType } from '@/lib/types'

import { getDefaultPosts, getPostsBySerch, getQuestionBySlug } from '@/db/post'
import { getAnswersByQuestionSlug } from '@/db/answer'
import { revalidatePath } from 'next/cache'
import { el } from '@faker-js/faker'

// create either a question or an article post
export const createPost = async (
  data: z.infer<typeof CreateQuestionOrArticleSchema>,
  type: CreatePostType
) => {
  const validatedData = CreateQuestionOrArticleSchema.safeParse(data)
  const user = await currentUser()

  if (!user) {
    return { type: 'error', message: 'Login first' }
  }

  if (!validatedData.success) {
    return { type: 'error', message: 'Invalid data' }
  }

  await db.post.create({
    data: {
      title: data.title,
      content: data.content,
      authorId: user.id,
      preview: data.content.slice(0, 100),
      type,
      slug: slugify(data.title),
    },
  })

  return { type: 'success', message: 'Post created' }
}

// create answer post to a question post
export const createAnswer = async (
  data: z.infer<typeof CreateAnswerScheme>,
  questionId: string,
  questionSlug: string | null
) => {
  const validatedData = CreateAnswerScheme.safeParse(data)
  const user = await currentUser()

  if (!user) {
    return { type: 'error', message: 'Login first' }
  }

  if (!validatedData.success) {
    return { type: 'error', message: 'Invalid data' }
  }

  await db.post.create({
    data: {
      authorId: user.id,
      content: data.content,
      type: 'ANSWER',
      questionId,
    },
  })

  revalidatePath(`/question/${questionSlug}`)
  return { type: 'success', message: 'Answer created' }
}

export const fetchPostsInitial = async (
  search: string | undefined,
  take: number
) => {
  if (!search) {
    const initialPosts = await getDefaultPosts(take, undefined)
    const myCursor = initialPosts?.[initialPosts.length - 1]?.id
    revalidatePath('/')
    return { initialPosts, myCursor }
  } else {
    const initialPosts = await getPostsBySerch(search, take, undefined)
    const myCursor = initialPosts?.[initialPosts.length - 1]?.id
    revalidatePath('/')
    return { initialPosts, myCursor }
  }
}

export const fetchMorePosts = async (
  search: string | undefined,
  take: number,
  cursor: string
) => {
  if (!search) {
    const newPosts = await getDefaultPosts(take, cursor)
    const myCursor = newPosts?.[newPosts.length - 1]?.id
    revalidatePath('/')
    return { newPosts, myCursor }
  } else {
    const newPosts = await getPostsBySerch(search, take, cursor)
    const myCursor = newPosts?.[newPosts.length - 1]?.id
    revalidatePath('/')
    return { newPosts, myCursor }
  }
}

// first query to get question post by slug
export const fetchQuestionInitial = async (slug: string, take: number) => {
  const question = await getQuestionBySlug(slug)
  const initialAnswers = await getAnswersByQuestionSlug(slug, take, undefined)
  const myCursor = initialAnswers?.[initialAnswers.length - 1]?.id
  return { question, initialAnswers, myCursor }
}

// subsequent query to get more answers by question slug with pagination
export const fetchMoreAnswers = async (
  slug: string,
  take: number,
  cursor: string
) => {
  const newAnswers = await getAnswersByQuestionSlug(slug, take, cursor)
  const myCursor = newAnswers?.[newAnswers.length - 1]?.id
  return { newAnswers, myCursor }
}

'use server'

import { db } from '@/db/client'
import { z } from 'zod'
import { CreateAnswerScheme, CreateQuestionOrArticleSchema } from '@/schemas'
import { currentUser } from '@/lib/auth'
import { slugify } from '@/lib/slug'
import { CreatePostType } from '@/lib/types'

import { getQuestionBySlug } from '@/db/post'
import { getAnswersByQuestionSlug } from '@/db/answer'

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

export const createAnswer = async (
  data: z.infer<typeof CreateAnswerScheme>,
  questionId: string
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

  return { type: 'success', message: 'Answer created' }
}

export const fetchPost = async () => {
  return await db.post.findMany({
    where: {
      NOT: { type: 'ANSWER' },
    },
    include: {
      community: true,
      author: true,
      _count: {
        select: { comments: true },
      },
    },
  })
}

export const fetchQuestionInitial = async (slug: string, take: number) => {
  const question = await getQuestionBySlug(slug)
  const initialAnswers = await getAnswersByQuestionSlug(slug, take)
  const myCursor = initialAnswers?.[initialAnswers.length - 1]?.id
  return { question, initialAnswers, myCursor }
}

export const fetchMoreAnswers = async (
  slug: string,
  take: number,
  cursor: string
) => {
  const newAnswers = await getAnswersByQuestionSlug(slug, take, cursor)
  const myCursor = newAnswers?.[newAnswers.length - 1]?.id
  return { newAnswers, myCursor }
}

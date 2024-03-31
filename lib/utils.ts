import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { customAlphabet } from 'nanoid'
import { ExtendedUser } from '@/auth'
import { PostType } from '@prisma/client'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(number: number) {
  return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(number)
}

export const postNanoid = customAlphabet('1234567890', 10)

export const optimisticAnswer = (
  user: ExtendedUser,
  title: string,
  content: string
) => {
  return {
    community: null,
    author: {
      id: user.id,
      name: user.name as string,
      slug: user.slug,
      email: user.email as string,
      emailVerified: null,
      image: null,
      password: null,
    },
    _count: { children: 0 },
    id: 'temp-id',
    title,
    content,
    type: PostType.answer,
    authorId: user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    votes: 0,
    views: 0,
    bookmarks: 0,
    parentId: null,
    communityId: null,
  }
}

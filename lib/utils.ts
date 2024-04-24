import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { customAlphabet } from 'nanoid'
import { generateUploadButton } from '@uploadthing/react'

import type { OurFileRouter } from '@/app/(root)/api/uploadthing/core'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(number: number) {
  return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(number)
}

export function calcVoteStatus({
  upVotes,
  downVotes,
  userId,
}: {
  upVotes: { id: string }[]
  downVotes: { id: string }[]
  userId: string | undefined
}) {
  if (userId && upVotes.find(({ id }) => id === userId)) return 1
  if (userId && downVotes.find(({ id }) => id === userId)) return -1
  return 0
}

export const postNanoid = customAlphabet('1234567890', 10)

export const UploadButton = generateUploadButton<OurFileRouter>()

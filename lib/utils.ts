import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { customAlphabet } from 'nanoid'
import {
  generateUploadButton,
  generateUploadDropzone,
} from '@uploadthing/react'

import type { OurFileRouter } from '@/app/(root)/api/uploadthing/core'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(number: number) {
  return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(number)
}

export const postNanoid = customAlphabet('1234567890', 10)

export const UploadButton = generateUploadButton<OurFileRouter>()
export const UploadDropzone = generateUploadDropzone<OurFileRouter>()

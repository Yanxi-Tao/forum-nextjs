'use server'

import { db } from '@/db/client'
import { currentUser } from '@/lib/auth'
import { ReportSchemaTypes } from '@/lib/types'
import { ReportSchema } from '@/schemas'

export const createReport = async (data: ReportSchemaTypes) => {
  const user = await currentUser()
  if (!user) {
    return { type: 'error', message: 'User not found' }
  }
  const validatedData = ReportSchema.safeParse(data)
  if (!validatedData.success) {
    return { type: 'error', message: 'Invalid data' }
  }

  const {
    postId,
    reportUserId,
    userId,
    commentId,
    communitySlug,
    reason,
    description,
    type,
  } = validatedData.data

  try {
    await db.report.create({
      data: {
        type,
        userId,
        reportedById: reportUserId,
        postId,
        commentId,
        communitySlug,
        reason,
        description,
      },
    })
  } catch (error) {
    console.error(error)
    return { type: 'error', message: 'Failed to create report' }
  }
}

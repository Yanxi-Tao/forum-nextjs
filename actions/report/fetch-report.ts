'use server'

import { db } from '@/db/client'
import { unstable_noStore } from 'next/cache'

export const fetchReport = async () => {
  unstable_noStore()
  try {
    const reports = await db.report.findMany({
      include: {
        post: {
          include: {
            author: true,
          },
        },
        comment: {
          include: {
            author: true,
          },
        },
        community: true,
        reportedBy: true,
        user: {
          include: {
            profile: true,
          },
        },
      },
    })
    return reports
  } catch {
    return []
  }
}

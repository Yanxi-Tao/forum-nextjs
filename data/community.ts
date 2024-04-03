import { db } from '@/db/client'

export const getCommunityBySlug = async (slug: string) => {
  try {
    const community = await db.community.findUnique({
      where: {
        slug,
      },
    })
    return community
  } catch {
    return null
  }
}

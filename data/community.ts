import { db } from '@/db/client'

export const getCommunityByName = async (name: string) => {
  try {
    const community = await db.community.findUnique({
      where: {
        name,
      },
    })
    return community
  } catch {
    return null
  }
}

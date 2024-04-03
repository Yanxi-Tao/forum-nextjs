'use server'

import { getUserProfileBySlug } from '@/data/profile'
import { unstable_noStore } from 'next/cache'

export const fetchProfile = async (slug: string) => {
  unstable_noStore()
  return await getUserProfileBySlug(slug)
}

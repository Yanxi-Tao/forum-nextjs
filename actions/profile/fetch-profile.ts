'use server'

import { getUserProfileBySlug, getEditUserProfileById } from '@/data/profile'
import { unstable_noStore } from 'next/cache'

export const fetchProfile = async (slug: string) => {
  unstable_noStore()
  return await getUserProfileBySlug(slug)
}

export const fetchEditProfile = async (id: string) => {
  unstable_noStore()
  return await getEditUserProfileById(id)
}

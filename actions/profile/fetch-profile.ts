'use server'

import { getUserProfileById, getEditUserProfileById } from '@/data/profile'
import { unstable_noStore } from 'next/cache'

export const fetchProfile = async (id: string) => {
  unstable_noStore()
  return await getUserProfileById(id)
}

export const fetchEditProfile = async (id: string) => {
  unstable_noStore()
  return await getEditUserProfileById(id)
}

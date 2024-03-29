'use server'
import { redirect } from 'next/navigation'

export const onSearch = (searchParams: FormData) => {
  console.log('searchParams', searchParams.get('search'))

  const search = searchParams.get('search')
  return redirect(`/search?search=${search}`)
}

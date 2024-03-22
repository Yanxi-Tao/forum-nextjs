'use client'
import { Input } from '@/components/ui/input'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export const Search = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Create a query string with the search parameter
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  // Handle the search form submission
  // update the search query parameter
  const onSearch = (data: FormData) => {
    const search = data.get('search') as string
    const query = createQueryString('search', search)
    router.push(`${pathname}?${query}`)
  }
  return (
    <form action={onSearch}>
      <Input
        placeholder="Search"
        className="w-96 focus-visible:ring-0 focus-visible:ring-offset-0 h-11"
        autoComplete="off"
        name="search"
        onKeyUp={(e) => e.key === 'Enter' && e.currentTarget.blur()}
      />
    </form>
  )
}

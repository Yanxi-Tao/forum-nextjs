'use client'
import { Input } from '@/components/ui/input'
import { SearchIcon, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Button } from '@/components/ui/button'

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
    <form action={onSearch} className="flex items-center rounded-full border">
      {/* todo: add filter badge */}
      <Input
        placeholder="Search"
        className="w-96 focus-visible:ring-0 focus-visible:ring-offset-0 h-10 rounded-none rounded-l-full border-0"
        autoComplete="off"
        name="search"
        onKeyUp={(e) => e.key === 'Enter' && e.currentTarget.blur()}
      />
      <div className="flex items-center justify-center rounded-r-full w-10 h-10 bg-background">
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <SearchIcon size={20} />
        </Button>
      </div>
    </form>
  )
}

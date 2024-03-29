'use client'
import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { onSearch } from '@/actions/search'

export const Search = () => {
  const router = useRouter()
  const search = useSearchParams().get('search') || ''
  const pathname = usePathname()
  // if (!pathname.startsWith('/communities') && pathname !== '/') {
  //   return null
  // }

  return (
    <form className="flex items-center rounded-full border my-1">
      {/* todo: add filter badge */}
      <Input
        placeholder="Search"
        defaultValue={search}
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

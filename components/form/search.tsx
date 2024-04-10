'use client'
import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export const Search = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const search = searchParams.get('search') || ''
  const communitySlug = pathname.split('/')[1] === 'community' ? pathname.split('/')[2] || null : null
  const actionRedirect = communitySlug ? `/community/${communitySlug}` : '/'

  return (
    <form className="flex items-center rounded-full border my-1 bg-background" action={actionRedirect}>
      {communitySlug && (
        <>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-full mx-1 h-8 bg-primary/15"
            onClick={() => {
              router.push(`/?search=${search}`)
              router.refresh()
            }}
          >
            {communitySlug}
          </Button>
          <Separator orientation="vertical" className="h-7 ml-1.5" />
        </>
      )}
      <Input
        placeholder="Search"
        defaultValue={search}
        className={`w-96 focus-visible:ring-0 focus-visible:ring-offset-0 h-10 rounded-none rounded-l-full border-0 ${
          communitySlug && 'rounded-none'
        }`}
        autoComplete="off"
        name="search"
      />
      <div className="flex items-center justify-center rounded-r-full w-10 h-10 bg-background">
        <Button type="submit" variant="ghost" size="icon" className="rounded-full">
          <SearchIcon size={20} />
        </Button>
      </div>
    </form>
  )
}

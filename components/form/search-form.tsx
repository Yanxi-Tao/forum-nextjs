'use client'
import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next-nprogress-bar'

export const Search = () => {
  const router = useRouter()
  const pathname = usePathname()
  const updatedCommunitySlug = useMemo(
    () =>
      pathname.split('/')[1] === 'community'
        ? pathname.split('/')[2] || null
        : null,
    [pathname]
  )
  const [communitySlug, setCommunitySlug] = useState(updatedCommunitySlug)
  useEffect(() => {
    setCommunitySlug(updatedCommunitySlug)
  }, [updatedCommunitySlug])
  const actionRedirect = communitySlug ? `/community/${communitySlug}` : '/'
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <form
      className="flex items-center rounded-full border my-1 bg-background"
      // action={actionRedirect}
      onSubmit={(e) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const search = formData.get('search') as string
        inputRef.current?.blur()
        router.push(`${actionRedirect}?search=${search}`)
        router.refresh()
      }}
    >
      {communitySlug && (
        <>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-full mx-1 h-8 bg-primary/15"
            onClick={() => setCommunitySlug(null)}
          >
            {communitySlug}
            <IoCloseCircleOutline size={20} className="ml-1.5" />
          </Button>
          <Separator orientation="vertical" className="h-7 ml-1.5" />
        </>
      )}
      <Input
        ref={inputRef}
        placeholder="Search"
        className={`w-96 focus-visible:ring-0 focus-visible:ring-offset-0 h-10 rounded-none rounded-l-full border-0 ${
          communitySlug && 'rounded-none'
        }`}
        autoComplete="off"
        name="search"
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

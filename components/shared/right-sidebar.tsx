'use client'
import { Button } from '@/components/ui/button'
import { CircleHelp } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

export const RightSidebar = () => {
  return (
    <div className="sticky top-12 h-[calc(100vh-48px)] w-[450px] border-l pb-10 pt-4 px-6 flex justify-center items-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="my-2 py-6 gap-x-3 focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <CircleHelp size={24} />
            Help
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Link href="https://forms.gle/vXLj1Ke7n6jPyi9T9" target="_blank">
              Bug report
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="https://forms.gle/i2EBFuYEGH3YtXXQ6" target="_blank">
              Feature request
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

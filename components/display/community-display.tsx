'use client'

import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AvatarCard, EditableAvatarCard } from '@/components/card/avatar-card'
import { HiDotsHorizontal } from 'react-icons/hi'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CommunityDisplayProps } from '@/lib/types'
import { useCurrentUser } from '@/hooks/user'
import { HiFlag } from 'react-icons/hi2'
import { ReportForm } from '../form/report-form'

export const CommunityDisplay = ({ community }: CommunityDisplayProps) => {
  const user = useCurrentUser()
  return (
    <CardHeader className="bg-muted rounded-xl">
      <div className="flex space-x-4">
        {user?.id === community.ownerId ? (
          <EditableAvatarCard
            source={community.image}
            name={community.name}
            slug={community.slug}
            type="community"
            className="h-36 w-36 text-3xl"
          />
        ) : (
          <AvatarCard
            source={community.image}
            name={community.name}
            className="h-36 w-36 text-3xl"
          />
        )}
        <div className="w-full mt-4 flex flex-col space-y-2">
          <CardTitle className="bg-muted rounded-lg">
            {community.name}
          </CardTitle>
          <CardDescription>{community.description}</CardDescription>
        </div>
        <div className="flex flex-col justify-between items-end">
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger className="h-fit focus:outline-none">
                <HiDotsHorizontal size={20} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {user?.id && (
                  <DialogTrigger asChild>
                    <DropdownMenuItem>
                      <HiFlag size={16} className="mr-2" />
                      Report
                    </DropdownMenuItem>
                  </DialogTrigger>
                )}
                {user?.id === community.ownerId && (
                  <DropdownMenuItem>
                    <Link href={`/community/${community.slug}/edit`}>
                      Edit Community
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report</DialogTitle>
              </DialogHeader>
              <ReportForm
                communitySlug={community.slug}
                reportUserId={user?.id as string}
              />
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm">
            <Link href={`/community/${community.slug}/create`}>
              Create Post
            </Link>
          </Button>
        </div>
      </div>
    </CardHeader>
  )
}

'use client'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export const UserAccountCard = () => {
  const user = useCurrentUser()
  const router = useRouter()

  const initial =
    user?.name
      ?.match(/(^\S\S?|\s\S)?/g)
      ?.map((v) => v.trim())
      .join('')
      ?.match(/(^\S|\S$)?/g)
      ?.join('')
      .toLocaleUpperCase() || 'NA'

  return (
    <div>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage
                src={user?.image || 'profile-default.png'}
                alt="profile pic"
              />
              <AvatarFallback className="border">{initial}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent collisionPadding={{ right: 20 }}>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex gap-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              router.push('/auth/login')
            }}
          >
            Login
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              router.push('/auth/register')
            }}
          >
            Sign in
          </Button>
        </div>
      )}
    </div>
  )
}

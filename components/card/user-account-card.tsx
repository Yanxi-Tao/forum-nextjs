'use client'

import { useCurrentUser } from '@/hooks/user'
import { signOut } from 'next-auth/react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { LogIn, LogOut, Settings } from 'lucide-react'
import Link from 'next/link'
import { AvatarCard } from '@/components/card/avatar-card'

export const UserAccountCard = () => {
  const user = useCurrentUser()

  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="py-8 gap-x-3 focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <AvatarCard source={user.image} name={user.name} />
              <div>{user.name}</div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Link href="/settings">
              <DropdownMenuItem className="justify-start gap-x-3 p-3">
                <Settings size={20} />
                Settings
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="justify-start gap-x-3 p-3"
              onClick={() => signOut()}
            >
              <LogOut size={20} />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div>
          <Button
            variant="ghost"
            className="relative flex justify-start gap-x-4 p-6 w-full"
            asChild
          >
            <Link href="/auth/login">
              <LogIn size={20} />
              <p>Login</p>
            </Link>
          </Button>
        </div>
      )}
    </>
  )
}

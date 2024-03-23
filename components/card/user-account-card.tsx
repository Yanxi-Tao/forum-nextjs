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
import { LogIn, LogOut, Settings } from 'lucide-react'

export const UserAccountCard = () => {
  const user = useCurrentUser()
  const router = useRouter()

  const initial = user?.name?.[0].toLocaleUpperCase()

  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="py-8 gap-x-3 focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              {user.image ? (
                <Avatar>
                  <AvatarImage src={user.image} alt="profile pic" />
                  <AvatarFallback className="border">{initial}</AvatarFallback>
                </Avatar>
              ) : (
                <div className="flex justify-center items-center bg-[#877EFF] rounded-full w-12 h-12">
                  <span className="text-2xl">{initial}</span>
                </div>
              )}

              <div>{user.name}</div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className="justify-start gap-x-3 p-3"
              onClick={() => router.push('/settings')}
            >
              <Settings size={20} />
              Settings
            </DropdownMenuItem>
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
            onClick={() => router.push('/auth/login')}
          >
            <LogIn size={20} />
            <p>Login</p>
          </Button>
        </div>
      )}
    </>
  )
}

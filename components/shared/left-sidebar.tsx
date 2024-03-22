'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { ScrollArea } from '@/components/ui/scroll-area'
import { sidebarNavs } from '@/constants'
import { Button } from '@/components/ui/button'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { UserAccountCard } from '@/components/card/user-account-card'

export const LeftSidebar = () => {
  const user = useCurrentUser()
  const pathname = usePathname()
  return (
    <div className="h-screen border-r">
      <ScrollArea className="h-full w-fit px-6 ">
        <div className="h-screen w-fit flex flex-col justify-between py-6">
          <div className="flex flex-col gap-y-3">
            <Link href="/" className="flex justify-center items-center">
              <p className="text-3xl">IBZN</p>
            </Link>
            {sidebarNavs.map((nav, index) => {
              const isActive =
                (pathname.includes(nav.route) && nav.route.length > 1) ||
                pathname === nav.route
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className={`flex justify-start p-6 ${
                    isActive &&
                    'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
                  }`}
                  asChild
                >
                  <Link
                    href={nav.route}
                    className="relative flex items-center justify-start gap-x-4"
                  >
                    {<nav.icon size={24} />}
                    <p>{nav.label}</p>
                  </Link>
                </Button>
              )
            })}
          </div>
          <UserAccountCard />
        </div>
      </ScrollArea>
    </div>
  )
}

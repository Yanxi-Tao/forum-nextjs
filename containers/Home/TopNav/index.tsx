import * as React from 'react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Codesandbox, Bell } from 'lucide-react'

export default function TopNav(): JSX.Element {
  return (
    <div className="flex items-center h-14 border-b drop-shadow-sm sticky top-0 bg-background z-10">
      <div className=" basis-1/3 flex justify-center">IBZN</div>
      <div className="basis-1/3">
        <form className="flex space-x-2 w-[500px] items-center">
          <Input
            autoComplete="off"
            type="text"
            name="search"
            className="focus-visible:ring-0 focus-visible:ring-offset-0 w-full py-4"
          />
          <Button type="button">Ask</Button>
        </form>
      </div>
      <div className="basis-1/3 flex space-x-2 items-center justify-center">
        <Button title="Workspace" variant="ghost">
          <Codesandbox className="h-5 w-5 mr-2" />
          Workspace
        </Button>
        <Button variant="ghost">
          <Bell className="h-5 w-5 mr-2" />
          Notification
        </Button>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}

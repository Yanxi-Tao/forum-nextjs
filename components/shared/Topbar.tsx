import { Bell, Codesandbox } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

export default function Topbar(): JSX.Element {
  return (
    <nav className="fixed top-0 left-0 right-0 flex items-center h-14 border-b drop-shadow-sm bg-background z-30">
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
    </nav>
  )
}

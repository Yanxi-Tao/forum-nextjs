import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Home } from 'lucide-react'

export default function SideNav(): JSX.Element {
  return (
    <div className="basis-[20%] flex flex-col items-center p-5 border-r">
      <div className="sticky top-20 w-full">
        <div className="w-full">
          <Button className="w-full justify-start items-center" variant="ghost">
            <Home className="h-full mx-4" />
            <span>Home</span>
          </Button>
        </div>
        <Separator className="my-4" />
      </div>
    </div>
  )
}

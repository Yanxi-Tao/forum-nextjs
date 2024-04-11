'use client'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'

export const RightSidebar = () => {
  const pathname = usePathname()
  const isCommunity = pathname.startsWith('/communities') && pathname !== '/communities/create'
  return (
    <div className="sticky top-12 h-[calc(100vh-48px)] w-[450px] border-l px-4 flex justify-center">
      {/* <Button>Placeholder ...</Button> */}
    </div>
  )
}

import { ScrollArea } from '@/components/ui/scroll-area'
import { Search } from '@/components/form/search'

export const MainContentWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <div className="flex flex-col h-screen w-full justify-center items-center">
      <div className="sticky top-0 flex justify-center items-center w-full bg-muted h-14">
        <Search />
      </div>
      <ScrollArea className="h-full w-full">{children}</ScrollArea>
    </div>
  )
}

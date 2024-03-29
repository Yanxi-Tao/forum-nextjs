import { ScrollArea } from '@/components/ui/scroll-area'
import { Search } from '@/components/form/search'

export const MainContentWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return <div className="w-full flex flex-col px-20">{children}</div>
}

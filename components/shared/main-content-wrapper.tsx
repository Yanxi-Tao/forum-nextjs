import { ScrollArea } from '@/components/ui/scroll-area'

export const MainContentWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <div className="flex h-screen justify-center pt-14">
      <ScrollArea className="h-full px-6">{children}</ScrollArea>
    </div>
  )
}

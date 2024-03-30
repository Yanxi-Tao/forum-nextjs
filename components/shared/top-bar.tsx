import { Search } from '@/components/form/search'

export const TopBar = () => {
  return (
    <header className="fixed left-0 right-0 top-0 flex h-12 bg-muted justify-center z-10">
      <Search />
    </header>
  )
}

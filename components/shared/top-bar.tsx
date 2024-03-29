import { Search } from '@/components/form/search'

export const TopBar = () => {
  return (
    <header className="sticky top-0 flex h-12 bg-muted justify-center z-10">
      <Search />
    </header>
  )
}

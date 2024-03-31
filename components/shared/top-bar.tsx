import { Search } from '@/components/form/search'
import { ModeToggle } from './mode-toggle'

export const TopBar = () => {
  return (
    <header className="sticky top-0 flex h-12 bg-muted items-center justify-center z-10">
      <div className="mx-auto">
        <Search />
      </div>
      <div className="mx-4">
        <ModeToggle />
      </div>
    </header>
  )
}

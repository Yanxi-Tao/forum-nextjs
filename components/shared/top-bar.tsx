import { Search } from '@/components/form/search-form'

export const TopBar = () => {
  // await createTestUsers()

  return (
    <header className="sticky top-0 flex h-12 bg-muted items-center justify-center z-10">
      <div className="mx-auto">
        <Search />
      </div>
    </header>
  )
}

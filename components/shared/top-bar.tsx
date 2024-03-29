import { Search } from '../form/search'

export const TopBar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-10 bg-muted flex justify-center">
      <Search />
    </div>
  )
}

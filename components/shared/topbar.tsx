import Link from 'next/link'
import { UserAccountCard } from '@/components/card/user-account-card'
import { Search } from '@/components/form/search'

export const Topbar = () => {
  return (
    <nav className="fixed top-0 z-30 flex w-full justify-between items-center h-14 px-6 bg-muted">
      <Link href="/" className="flex items-center">
        <p className=" text-3xl">IBZN</p>
      </Link>
      <Search />
      <UserAccountCard />
    </nav>
  )
}

import Link from 'next/link'

export const Topbar = () => {
  return (
    <nav className="fixed top-0 z-30 flex w-full justify-between h-14 px-6">
      <Link href="/" className="flex items-center">
        <p className=" text-3xl">IBZN</p>
      </Link>
    </nav>
  )
}

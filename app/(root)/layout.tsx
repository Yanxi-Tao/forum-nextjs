import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import '../globals.css'
import Topbar from '@/components/shared/Topbar'
import LeftSidebar from '@/components/shared/LeftSidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IBZN',
  description: 'IB Forum',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Topbar />
          <main className="flex">
            <LeftSidebar />
            <section className="flex h-screen pt-14 overflow-auto">
              <div className="w-full">{children}</div>
            </section>
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}

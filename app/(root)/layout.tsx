import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { auth } from '@/auth'
import { SessionProvider } from 'next-auth/react'
import { LeftSidebar } from '@/components/shared/left-sidebar'
import { RightSidebar } from '@/components/shared/right-sidebar'
import { TopBar } from '@/components/shared/top-bar'

import {
  ProgressBarProvider,
  ReactQueryProvider,
  ThemeProvider,
} from '@/lib/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IBZN',
  description: 'Generated by create next app',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overscroll-y-contain`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider session={session}>
            <ReactQueryProvider>
              <ProgressBarProvider>
                <TopBar />
                <main>
                  <div className="relative w-screen flex">
                    <LeftSidebar />
                    <div className="w-full px-20 pt-4">{children}</div>
                    <RightSidebar />
                  </div>
                </main>
              </ProgressBarProvider>
            </ReactQueryProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

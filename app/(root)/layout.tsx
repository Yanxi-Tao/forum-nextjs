import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { auth } from '@/auth'
import { SessionProvider } from 'next-auth/react'
import { LeftSidebar } from '@/components/shared/left-sidebar'
import { RightSidebar } from '@/components/shared/right-sidebar'
import { TopBar } from '@/components/shared/top-bar'
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin'
import { extractRouterConfig } from 'uploadthing/server'
import { ourFileRouter } from '@/app/(root)/api/uploadthing/core'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { CSPostHogProvider } from '@/lib/providers'

import {
  ProgressBarProvider,
  ReactQueryProvider,
  ThemeProvider,
} from '@/lib/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IBZN',
  description:
    'A versatile interactive forum for International Baccalaureate (IB) students in order to facilitate success in learning, help course selection, and provide a platform for information exchange and experience sharing',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overscroll-y-contain root`}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider session={session}>
            <CSPostHogProvider>
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
            </CSPostHogProvider>
          </SessionProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

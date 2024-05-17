import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { auth } from '@/auth'
import { SessionProvider } from 'next-auth/react'
import { TopBar } from '@/components/shared/top-bar'
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin'
import { extractRouterConfig } from 'uploadthing/server'
import { ourFileRouter } from '@/app/(root)/api/uploadthing/core'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

import {
  ProgressBarProvider,
  ReactQueryProvider,
  ThemeProvider,
} from '@/lib/providers'
import { redirect } from 'next/navigation'
import { ModerateSideBar } from '@/components/shared/moderate-sidebar'
import { UserRole } from '@prisma/client'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Moderate IBZN',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  if (!session || session.user.role !== UserRole.ADMIN) return redirect('/')
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overscroll-y-contain root moderate`}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider session={session}>
            <ReactQueryProvider>
              <ProgressBarProvider>
                <main>
                  <div className="relative w-screen flex">
                    {/* <ModerateSideBar /> */}
                    <div className="w-full px-20 pt-4">{children}</div>
                  </div>
                </main>
              </ProgressBarProvider>
            </ReactQueryProvider>
          </SessionProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

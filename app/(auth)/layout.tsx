import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { Suspense } from 'react'
import { ProgressBarProvider } from '@/lib/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Authentication Service',
  description: 'Authentication Service',
}

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} auth`}>
        <div className="h-screen flex justify-center items-center">
          <Suspense fallback={null}>
            <ProgressBarProvider>{children}</ProgressBarProvider>
          </Suspense>
        </div>
      </body>
    </html>
  )
}

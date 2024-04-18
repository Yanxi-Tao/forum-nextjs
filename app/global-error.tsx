'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BiMessageAltError } from 'react-icons/bi'

import './globals.css'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex h-screen w-screen justify-center items-center">
          <div className="max-w-md text-center space-y-4">
            <BiMessageAltError className="mx-auto text-6xl" />
            <h1 className="text-4xl font-bold tracking-tight">
              Oops, something went wrong!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              We&apos;re sorry, but the page you were trying to access is not
              available. Please try again later or go back to the homepage.
            </p>
            <div className="flex space-x-4 justify-center">
              <Button
                onClick={
                  // Attempt to recover by trying to re-render the segment
                  () => reset()
                }
              >
                Try again
              </Button>
              <Button>
                <Link href="/">Go back home</Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

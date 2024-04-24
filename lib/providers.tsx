// In Next.js, this file would be called: app/providers.jsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        refetchInterval: 30 * 1000,
        gcTime: Infinity,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient()
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

export const ReactQueryProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      {children}
    </QueryClientProvider>
  )
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export function ProgressBarProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ProgressBar
        height="2px"
        options={{
          showSpinner: false,
        }}
        shallowRouting
      />
      {children}
    </>
  )
}

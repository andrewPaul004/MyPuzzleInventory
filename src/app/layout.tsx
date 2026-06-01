import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { ThemeProvider } from 'next-themes'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  // Variable font axes: opsz (optical size), WONK (wonky), SOFT (softness).
  // wght (weight) variation is applied via font-variation-settings in globals.css .font-display class.
  axes: ['SOFT', 'WONK', 'opsz'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MyPuzzleInventory',
  description: 'Track and manage your jigsaw puzzle collection',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${inter.variable}`}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <NuqsAdapter>{children}</NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  )
}

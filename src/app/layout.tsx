import type { Metadata } from 'next'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import './globals.css'

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
    <html lang="en">
      <body>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  )
}

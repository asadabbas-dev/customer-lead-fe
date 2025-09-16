import './globals.css'  // This line must be present
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Customer Lead Management System',
  description: 'Manage customers and leads with image upload capabilities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Your navigation content */}
        {children}
      </body>
    </html>
  )
}
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AnalytIQ Hub - Comprehensive Data Analytics Platform',
  description: 'Upload, explore, and visualize datasets with AI-powered analytics and customizable dashboards',
  keywords: ['data analytics', 'business intelligence', 'dashboards', 'AI insights', 'data visualization'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background font-sans antialiased">
          {children}
        </div>
      </body>
    </html>
  )
}
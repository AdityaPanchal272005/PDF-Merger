import { type Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'PDF Tools – Merge, Split & Edit PDFs Free Online',
    template: '%s | PDF Tools',
  },
  description: 'Free online PDF tools. Merge multiple PDFs, extract pages, and more — instantly in your browser. No signup, no watermarks, 100% secure.',
  keywords: ['pdf merger', 'merge pdf', 'pdf tools', 'pdf splitter', 'combine pdf', 'free pdf'],
  openGraph: {
    title: 'PDF Tools – Merge, Split & Edit PDFs Free Online',
    description: 'Free online PDF tools. Merge, split, and extract pages from PDFs instantly. No signup required.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Tools – Merge, Split & Edit PDFs Free',
    description: 'Free online PDF tools. Merge, split, and extract pages instantly. No signup required.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}

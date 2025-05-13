import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { GeistSans } from 'geist/font/sans';
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "SafeCircle",
  description: "Experience our revolutionary security platform.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${GeistSans.className} bg-[#080808]`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

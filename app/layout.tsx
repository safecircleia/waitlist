import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { GeistSans } from 'geist/font/sans';
import { ThemeProvider } from "@/components/theme-provider"
import { BackgroundGradientAnimation } from "@/components/background"

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
      <body className={`${GeistSans.className}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <BackgroundGradientAnimation
            containerClassName="fixed inset-0 z-0 w-full h-full"
            className="relative z-10 w-full min-h-screen"
          >
            {children}
          </BackgroundGradientAnimation>
        </ThemeProvider>
      </body>
    </html>
  )
}

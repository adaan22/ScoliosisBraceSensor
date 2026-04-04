import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { BrandingLogos } from "@/components/branding-logos"
import { ThemeProvider } from "@/components/theme-provider"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
    >
      <body>
        <ThemeProvider>
          <div className="flex min-h-screen flex-col bg-white">
            <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center border-b border-neutral-200/80 bg-white px-4 md:px-6">
              <BrandingLogos />
            </header>
            <main className="flex min-h-0 flex-1 flex-col">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

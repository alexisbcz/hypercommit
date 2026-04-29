import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils";

export const metadata: Metadata = {
  title: {
    default: "Hypercommit",
    template: "%s - Hypercommit",
  },
  description: "Level up as a software engineer.",
  applicationName: "Hypercommit",
  authors: [{ name: "Alexis Bouchez" }],
  creator: "Alexis Bouchez",
  publisher: "Alexis Bouchez",
  openGraph: {
    title: "Hypercommit",
    description: "Level up as a software engineer.",
    siteName: "Hypercommit",
    type: "website",
    locale: "en_US",
  },
}

const geist = Geist({subsets:['latin'],variable:'--font-sans'})

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
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}

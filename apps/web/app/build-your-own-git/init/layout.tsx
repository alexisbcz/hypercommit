import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Repository initialization",
  description:
    "Implement git init from scratch — what files Git creates and why.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

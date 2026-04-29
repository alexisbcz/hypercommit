"use client"

import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"

type Heading = { text: string; slug: string }

export function OnThisPage({ headings }: { headings: Heading[] }) {
  const [activeSlug, setActiveSlug] = React.useState<string | null>(
    headings[0]?.slug ?? null
  )

  React.useEffect(() => {
    if (headings.length === 0) return

    const elements = headings
      .map((h) => document.getElementById(h.slug))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const visible = new Set<string>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        const firstVisible = headings.find((h) => visible.has(h.slug))
        if (firstVisible) setActiveSlug(firstVisible.slug)
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 }
    )

    for (const el of elements) observer.observe(el)
    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-3 font-medium text-foreground">On This Page</p>
      <ul className="flex flex-col gap-2 border-l border-border">
        {headings.map((h) => (
          <li key={h.slug}>
            <a
              href={`#${h.slug}`}
              className={cn(
                "-ml-px block border-l border-transparent pl-3 transition-colors hover:text-foreground",
                activeSlug === h.slug
                  ? "border-foreground font-medium text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

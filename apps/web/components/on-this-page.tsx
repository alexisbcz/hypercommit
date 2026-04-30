"use client"

import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { Menu01Icon } from "@hugeicons/core-free-icons"

type Heading = { text: string; slug: string }

export function OnThisPage({ headings }: { headings: Heading[] }) {
  const [activeSlug, setActiveSlug] = React.useState<string | null>(
    headings[0]?.slug ?? null
  )
  const lockUntilRef = React.useRef(0)

  React.useEffect(() => {
    if (headings.length === 0) return

    const updateActive = () => {
      if (Date.now() < lockUntilRef.current) return

      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight

      if (scrollY + viewportHeight >= docHeight - 2) {
        setActiveSlug(headings[headings.length - 1]!.slug)
        return
      }

      const threshold = 120
      let current = headings[0]!.slug
      for (const h of headings) {
        const el = document.getElementById(h.slug)
        if (!el) continue
        if (el.getBoundingClientRect().top - threshold <= 0) current = h.slug
        else break
      }
      setActiveSlug(current)
    }

    updateActive()
    window.addEventListener("scroll", updateActive, { passive: true })
    window.addEventListener("resize", updateActive)
    return () => {
      window.removeEventListener("scroll", updateActive)
      window.removeEventListener("resize", updateActive)
    }
  }, [headings])

  const handleClick = (slug: string) => {
    setActiveSlug(slug)
    lockUntilRef.current = Date.now() + 1000
  }

  if (headings.length === 0) return null

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-3 -ml-1 flex flex-wrap items-center gap-1 font-medium text-foreground">
        <HugeiconsIcon className="size-4" icon={Menu01Icon} />
        <span>On This Page</span>
      </p>
      <ul className="flex flex-col gap-2 border-l border-border">
        {headings.map((h) => (
          <li key={h.slug}>
            <a
              href={`#${h.slug}`}
              onClick={() => handleClick(h.slug)}
              className={cn(
                "-ml-px block border-l border-transparent pl-3 transition-colors hover:text-foreground",
                activeSlug === h.slug
                  ? "border-foreground font-medium text-foreground"
                  : "text-foreground/70"
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

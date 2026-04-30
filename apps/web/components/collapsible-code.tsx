"use client"

import * as React from "react"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export function CollapsibleCode({
  title = "Show implementation",
  children,
}: {
  title?: string
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="my-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          className={
            "size-4 transition-transform " + (open ? "" : "-rotate-90")
          }
        />
        <span>{title}</span>
      </button>
      {open ? <div className="mt-2">{children}</div> : null}
    </div>
  )
}

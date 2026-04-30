"use client"

import * as React from "react"
import {
  ArrowDown01Icon,
  FileCodeIcon,
  Link04Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@workspace/ui/lib/utils"

export function CollapsibleCode({
  filename,
  href,
  caption,
  children,
}: {
  filename: string
  href?: string
  caption?: string
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const id = React.useId()

  return (
    <div
      className={cn(
        "my-3 overflow-hidden rounded-lg border border-border/70 bg-muted/40 shadow-2xs/2 transition-colors",
        open && "bg-muted/60"
      )}
    >
      <div className="flex items-center gap-1.5 px-1.5 py-1">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={id}
          aria-label={open ? `Collapse ${filename}` : `Expand ${filename}`}
          className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            className={cn(
              "size-3.5 transition-transform duration-200",
              open ? "rotate-0" : "-rotate-90"
            )}
          />
        </button>
        <HugeiconsIcon
          icon={FileCodeIcon}
          className="size-3.5 shrink-0 text-muted-foreground"
        />
        <span className="flex min-w-0 flex-1 items-baseline gap-1.5 font-mono text-xs">
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="truncate text-primary transition-colors hover:text-primary/80"
            >
              {filename}
            </a>
          ) : (
            <span className="truncate text-foreground">{filename}</span>
          )}
          {caption ? (
            <span className="truncate text-muted-foreground">{caption}</span>
          ) : null}
        </span>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <span>View source</span>
            <HugeiconsIcon icon={Link04Icon} className="size-3" />
          </a>
        ) : null}
      </div>
      <div
        id={id}
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div
            className={cn(
              "border-t border-border/70 p-1",
              "[&_>div>pre]:rounded-md [&_>div>pre]:border-0 [&_>div>pre]:shadow-none"
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

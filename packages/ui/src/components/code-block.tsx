"use client"

import { useRef } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { CodeBlockHeader, CopyCodeButton } from "./code-block-header"

export function CodeBlock({
  children,
  filename,
}: {
  children: React.ReactNode
  filename?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const getCode = () => ref.current?.querySelector("pre")?.textContent ?? ""

  if (filename) {
    return (
      <div className="rounded-lg border border-border/70 bg-muted/70 p-1 pt-0">
        <CodeBlockHeader filename={filename} getCode={getCode} />
        <div
          ref={ref}
          className={cn(
            "grid",
            "[&>pre]:overflow-auto [&>pre]:rounded-md [&>pre]:border [&>pre]:border-border/70 [&>pre]:bg-card [&>pre]:p-4 [&>pre]:text-sm [&>pre]:leading-[1.6] [&>pre]:shadow-2xs/2 dark:[&>pre]:border-border/80",
            "[&_code]:bg-transparent [&_code]:p-0 [&_code]:border-0"
          )}
        >
          {children}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={cn(
        "group relative grid",
        "[&>pre]:overflow-auto [&>pre]:rounded-lg [&>pre]:border [&>pre]:border-border/70 [&>pre]:bg-card [&>pre]:p-4 [&>pre]:text-sm [&>pre]:leading-[1.6] [&>pre]:shadow-2xs/2 dark:[&>pre]:border-border/80",
        "[&_code]:bg-transparent [&_code]:p-0 [&_code]:border-0"
      )}
    >
      {children}
      <CopyCodeButton
        getCode={getCode}
        className="absolute top-1.5 right-1.5 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
      />
    </div>
  )
}

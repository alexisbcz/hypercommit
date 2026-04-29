"use client"

import { Copy01Icon, FileCodeIcon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Tooltip } from "@base-ui/react/tooltip"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { useCopyToClipboard } from "./use-copy-to-clipboard"

export function CopyCodeButton({
  getCode,
  className,
}: {
  getCode: () => string
  className?: string
}) {
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  return (
    <Tooltip.Provider delay={100} closeDelay={50}>
      <Tooltip.Root>
        <Tooltip.Trigger
          render={
            <Button
              className={cn("size-7 shrink-0", className)}
              onClick={() => copyToClipboard(getCode())}
              size="icon"
              variant="ghost"
              aria-label="Copy to clipboard"
            >
              <HugeiconsIcon
                icon={isCopied ? Tick02Icon : Copy01Icon}
                className="size-3.5"
              />
            </Button>
          }
        />
        <Tooltip.Portal>
          <Tooltip.Positioner side="bottom" sideOffset={6}>
            <Tooltip.Popup
              className={cn(
                "rounded-md border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md",
                "origin-[var(--transform-origin)]",
                "data-[open]:animate-in data-[open]:fade-in-0 data-[open]:zoom-in-95",
                "data-[closed]:animate-out data-[closed]:fade-out-0 data-[closed]:zoom-out-95",
                "data-[side=bottom]:slide-in-from-top-1",
                "data-[side=top]:slide-in-from-bottom-1",
                "data-[side=left]:slide-in-from-right-1",
                "data-[side=right]:slide-in-from-left-1",
                "data-[instant]:animate-none"
              )}
            >
              {isCopied ? "Copied" : "Copy to clipboard"}
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

export function CodeBlockHeader({
  filename,
  getCode,
}: {
  filename: string
  getCode: () => string
}) {
  return (
    <div className="flex items-center justify-between gap-2 py-1 ps-3 pe-1">
      <span className="flex min-w-0 items-center gap-1.5 font-mono text-xs text-muted-foreground">
        <HugeiconsIcon icon={FileCodeIcon} className="size-3.5 shrink-0" />
        <span className="truncate">{filename}</span>
      </span>
      <CopyCodeButton getCode={getCode} />
    </div>
  )
}

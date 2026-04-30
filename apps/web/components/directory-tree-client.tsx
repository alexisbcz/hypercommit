"use client"

import "@pierre/trees/web-components"
import { FileTree, useFileTree } from "@pierre/trees/react"

const COMPACT_ROW_HEIGHT = 24

function countVisibleNodes(paths: readonly string[]): number {
  const nodes = new Set<string>()
  for (const p of paths) {
    const segments = p.split("/").filter(Boolean)
    let acc = ""
    for (const seg of segments) {
      acc = acc ? `${acc}/${seg}` : seg
      nodes.add(acc)
    }
  }
  return nodes.size
}

export function DirectoryTreeClient({
  paths,
  initialExpansion,
  preloadedData,
}: {
  paths: readonly string[]
  initialExpansion: "open" | "closed" | number
  preloadedData: { id: string; shadowHtml: string }
}) {
  const { model } = useFileTree({
    paths,
    initialExpansion,
    density: "compact",
  })
  const height = countVisibleNodes(paths) * COMPACT_ROW_HEIGHT + 16

  return (
    <div
      className="overflow-hidden rounded-lg border border-border/70 bg-card text-sm shadow-sm"
      style={{ ["--trees-font-size-override" as string]: "0.875rem" }}
    >
      <FileTree
        model={model}
        preloadedData={preloadedData}
        className="block py-2"
        style={{ display: "block", height }}
      />
    </div>
  )
}

import { preloadFileTree } from "@pierre/trees/ssr"
import { DirectoryTreeClient } from "./directory-tree-client"

export function DirectoryTree({
  paths,
  initialExpansion = "open",
}: {
  paths: readonly string[]
  initialExpansion?: "open" | "closed" | number
}) {
  const payload = preloadFileTree({
    paths,
    initialExpansion,
    density: "compact",
  })
  return (
    <DirectoryTreeClient
      paths={paths}
      initialExpansion={initialExpansion}
      preloadedData={{ id: payload.id, shadowHtml: payload.shadowHtml }}
    />
  )
}

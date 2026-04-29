import * as React from "react"

function nodeToText(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return ""
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(nodeToText).join("")
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode }
    return nodeToText(props.children)
  }
  return ""
}

export function slugifyHeading(node: React.ReactNode): string {
  return nodeToText(node)
    .toLowerCase()
    .replace(/[`'"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function extractMdxHeadings(
  source: string,
  level: 2 | 3 = 2
): { text: string; slug: string }[] {
  const prefix = "#".repeat(level) + " "
  const headings: { text: string; slug: string }[] = []
  let inFence = false
  for (const raw of source.split("\n")) {
    const line = raw.trimEnd()
    if (line.startsWith("```")) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    if (line.startsWith(prefix)) {
      const text = line.slice(prefix.length).trim()
      headings.push({ text, slug: slugifyHeading(text) })
    }
  }
  return headings
}

import type { MDXComponents } from "mdx/types"
import * as React from "react"
import { CodeBlock } from "@workspace/ui/components/code-block"
import { slugifyHeading } from "@/lib/headings"

function HeadingAnchor({ id }: { id: string }) {
  return (
    <a
      href={`#${id}`}
      aria-label="Link to this section"
      className="ml-2 font-normal text-foreground/30 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
    >
      #
    </a>
  )
}

function extractFigcaptionText(node: React.ReactNode): string | undefined {
  let title: string | undefined
  React.Children.forEach(node, (child) => {
    if (!React.isValidElement(child)) return
    const props = child.props as Record<string, unknown> & {
      children?: React.ReactNode
    }
    if (props["data-rehype-pretty-code-title"] !== undefined) {
      if (typeof props.children === "string") title = props.children
    }
  })
  return title
}

function extractPre(node: React.ReactNode): React.ReactNode {
  let pre: React.ReactNode = null
  React.Children.forEach(node, (child) => {
    if (!React.isValidElement(child)) return
    const props = child.props as Record<string, unknown>
    if (props["data-rehype-pretty-code-title"] === undefined) {
      pre = child
    }
  })
  return pre
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <h1 className="text-lg font-semibold">{children}</h1>,
    h2: ({ children }) => {
      const id = slugifyHeading(children)
      return (
        <h2
          id={id}
          className="group mt-6 scroll-mt-6 text-base font-medium"
        >
          {children}
          <HeadingAnchor id={id} />
        </h2>
      )
    },
    h3: ({ children }) => {
      const id = slugifyHeading(children)
      return (
        <h3
          id={id}
          className="group mt-4 scroll-mt-6 text-base font-medium"
        >
          {children}
          <HeadingAnchor id={id} />
        </h3>
      )
    },
    p: ({ children }) => (
      <p className="text-base leading-7 text-foreground/80">{children}</p>
    ),
    a: ({ children, href }) => (
      <a
        href={href}
        className="text-primary underline-offset-4 hover:underline"
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="ms-5 list-disc space-y-1 text-base leading-7 text-foreground/80">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="ms-5 list-decimal space-y-1 text-base leading-7 text-foreground/80">
        {children}
      </ol>
    ),
    code: ({ children, ...props }) => (
      <code
        className="rounded border bg-muted px-1 py-0.5 font-mono text-sm text-foreground"
        {...props}
      >
        {children}
      </code>
    ),
    table: ({ children }) => (
      <div className="my-4 overflow-hidden rounded-lg border border-border">
        <table className="w-full border-collapse text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-muted [&_tr]:border-b [&_tr]:border-border">
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody className="[&_tr]:border-border [&_tr:not(:last-child)]:border-b">
        {children}
      </tbody>
    ),
    tr: ({ children }) => <tr>{children}</tr>,
    th: ({ children }) => (
      <th className="px-4 py-2 text-left text-base font-medium tracking-wide text-muted-foreground uppercase not-last:border-r not-last:border-border">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-2 text-sm leading-6 text-muted-foreground not-last:border-r not-last:border-border">
        {children}
      </td>
    ),
    figure: (props) => {
      const dataAttr = (props as Record<string, unknown>)[
        "data-rehype-pretty-code-figure"
      ]
      if (dataAttr === undefined) {
        return <figure {...props} />
      }
      const filename = extractFigcaptionText(props.children)
      const pre = extractPre(props.children)
      return <CodeBlock filename={filename}>{pre}</CodeBlock>
    },
    ...components,
  }
}

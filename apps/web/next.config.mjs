import createMDX from "@next/mdx"

import diffsDark from "./lib/shiki-themes/diffs-dark.json" with { type: "json" }
import diffsLight from "./lib/shiki-themes/diffs-light.json" with { type: "json" }

/** @type {import('rehype-pretty-code').Options} */
const rehypePrettyCodeOptions = {
  theme: { dark: diffsDark, light: diffsLight },
  defaultLang: "plaintext",
  keepBackground: false,
}

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [["remark-gfm", {}]],
    rehypePlugins: [["rehype-pretty-code", rehypePrettyCodeOptions]],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  transpilePackages: ["@workspace/ui"],
}

export default withMDX(nextConfig)

import { readFileSync } from "node:fs"
import path from "node:path"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"

import { OnThisPage } from "@/components/on-this-page"
import { JoinCommunityButton } from "@/components/join-community-button"
import { extractMdxHeadings } from "@/lib/headings"

import Content from "./content.mdx"

export default function Page() {
  const source = readFileSync(
    path.join(process.cwd(), "app/build-your-own-git/init/content.mdx"),
    "utf8"
  )
  const headings = extractMdxHeadings(source, 2)

  return (
    <div className="flex min-h-svh gap-12 p-8">
      <article className="flex max-w-2xl min-w-0 flex-1 flex-col gap-4 text-sm leading-loose">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">~</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/build-your-own-git">
                Build your own Git
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Repository initialization</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Content />
        <div className="mt-8 flex flex-col gap-2 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            Stuck or want to compare notes? Hop into the community.
          </p>
          <JoinCommunityButton />
        </div>
      </article>
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-6">
          <OnThisPage headings={headings} />
        </div>
      </aside>
    </div>
  )
}

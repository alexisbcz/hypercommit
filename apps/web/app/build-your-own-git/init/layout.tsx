import type { Metadata } from "next"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"

export const metadata: Metadata = {
  title: "Repository initialization",
  description:
    "Implement git init from scratch — what files Git creates and why.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh p-6">
      <article className="flex max-w-2xl min-w-0 flex-col gap-4 text-sm leading-loose">
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
        {children}
      </article>
    </div>
  )
}

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"

export const metadata = {
  title: "Build your own Git",
  description: "Reimplement Git, one plumbing command at a time.",
}

export default function Page() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex min-w-0 flex-col gap-4 text-sm leading-loose">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">~</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Courses</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Build your own Git</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div>
          <h1 className="text-lg font-semibold">Build your own Git</h1>
          <p className="text-lg text-muted-foreground">
            Implement the most used version control system in Go.
          </p>
        </div>
      </div>
    </div>
  )
}

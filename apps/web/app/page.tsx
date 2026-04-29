import Image from "next/image"
import Link from "next/link"
import illustration from "./courses/build-your-own-git/illustration.webp"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@workspace/ui/components/breadcrumb"

export default function Page() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>~</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div>
          <Image
            src="/logo.svg"
            alt="Hypercommit logo"
            width={40}
            height={40}
            priority
            className="mb-3 size-10 rounded-full"
          />
          <h1 className="text-lg font-semibold">Hypercommit</h1>
          <p className="text-lg text-muted-foreground">
            Level up as a software engineer, one commit at a time.
          </p>
        </div>

        <div className="mt-4">
          <Link
            tabIndex={0}
            className="no-underline"
            href="/courses/build-your-own-git"
          >
            <div className="pointer-events-auto relative flex aspect-1050/660 w-full items-center justify-center overflow-hidden rounded-lg bg-muted shadow-sm">
              <Image
                alt="Thumbnail for Build your own Git"
                src={illustration}
                width={illustration.width}
                height={illustration.height}
                sizes="(max-width: 768px) 100vw, 1050px"
                className="object-cover"
              />
            </div>
          </Link>
          <div>
            <h3 className="mt-4 text-base font-medium">Build your own Git</h3>
            <p className="text-base leading-6 text-muted-foreground">
              Implement the most used version control system in Go.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

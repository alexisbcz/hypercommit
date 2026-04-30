import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import illustration from "./illustration.webp"

export const metadata: Metadata = {
  title: "Build your own Git",
  description: "Reimplement Git, one command at a time.",
  openGraph: {
    title: "Build your own Git",
    description: "Reimplement Git, one command at a time.",
    images: [
      {
        url: illustration.src,
        width: illustration.width,
        height: illustration.height,
        alt: "Build your own Git",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Build your own Git",
    description: "Reimplement Git, one command at a time.",
    images: [illustration.src],
  },
}

export default function Page() {
  return (
    <div className="flex min-h-svh p-8">
      <div className="flex min-w-0 flex-col gap-4 text-sm leading-loose">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">~</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Build your own Git</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="pointer-events-auto relative flex aspect-1050/660 w-full max-w-md items-center justify-center overflow-hidden rounded-lg bg-muted shadow-sm">
          <Image
            alt="Thumbnail for Build your own Git"
            src={illustration}
            width={illustration.width}
            height={illustration.height}
            sizes="(max-width: 768px) 100vw, 1050px"
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-lg font-semibold">Build your own Git</h1>
          <p className="text-lg text-muted-foreground">
            Implement the most used version control system in Go.
          </p>
        </div>
        <div className="mt-4">
          <h2 className="text-base font-medium">Lessons</h2>
          <ol className="mt-2 flex flex-col gap-2">
            <li>
              <Link
                href="/build-your-own-git/init"
                className="group/lesson flex items-center gap-3 rounded-md no-underline transition-opacity hover:opacity-80"
              >
                <span className="text-sm text-muted-foreground tabular-nums">
                  01.
                </span>
                <span className="text-base text-foreground/80">
                  Repository initialization
                </span>
              </Link>
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}

import Image from "next/image"
import Link from "next/link"
import illustration from "./build-your-own-git/illustration.webp"
import { LogoMenu } from "./logo-menu"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@workspace/ui/components/breadcrumb"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { TangledIcon } from "./tangled-icon"
import { DiscordIcon } from "./discord-icon"

export default function Page() {
  return (
    <div className="flex min-h-svh p-8">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>~</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div>
          <LogoMenu />
          <h1 className="text-lg font-semibold">Hypercommit</h1>
          <p className="text-lg text-muted-foreground">
            Level up as a software engineer, one commit at a time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="https://discord.gg/UXJM9a2hqE"
            className={cn(
              buttonVariants({ size: "lg" }),
              "gap-1 self-start text-[15px] no-underline"
            )}
          >
            <DiscordIcon className="size-4" />
            Join the community
          </a>
          <a
            href="https://tangled.org/alexisbouchez.com/hypercommit"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "gap-1 self-start text-[15px] no-underline"
            )}
          >
            <TangledIcon className="mr-1 size-4" />
            Star on Tangled
          </a>
        </div>

        <Link
          tabIndex={0}
          className="group/course-card mt-4 block rounded-lg no-underline transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          href="/build-your-own-git"
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
          <div>
            <h3 className="mt-4 text-base font-medium">Build your own Git</h3>
            <p className="text-base leading-6 text-muted-foreground">
              Implement the most used version control system in Go.
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}

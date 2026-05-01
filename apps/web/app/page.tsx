import buildYourOwnGitIllustration from "./build-your-own-git/illustration.webp"
import learnJavascriptIllustration from "./learn-javascript/illustration.webp"
import { LogoMenu } from "./logo-menu"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@workspace/ui/components/breadcrumb"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { GitHubIcon } from "./github-icon"
import { JoinCommunityButton } from "@/components/join-community-button"
import { CourseCard, type Course } from "@/components/course-card"

const courses: Course[] = [
  {
    href: "/build-your-own-git",
    title: "Build your own Git",
    description: "Implement the most used version control system in Go.",
    illustration: buildYourOwnGitIllustration,
  },
  {
    href: "/learn-javascript",
    title: "Learn JavaScript",
    description: "Master the language that powers the web, from scratch.",
    illustration: learnJavascriptIllustration,
  },
]

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
          <JoinCommunityButton />
          <a
            href="https://github.com/alexisbcz/hypercommit"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "gap-1 self-start text-[15px] no-underline"
            )}
          >
            <GitHubIcon className="mr-1 size-4" />
            Star on GitHub
          </a>
        </div>

        <div className="mt-4 flex flex-col gap-6">
          {courses.map((course) => (
            <CourseCard key={course.href} course={course} />
          ))}
        </div>
      </div>
    </div>
  )
}

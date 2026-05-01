import Image, { type StaticImageData } from "next/image"
import Link from "next/link"

export type Course = {
  href: string
  title: string
  description: string
  illustration: StaticImageData
}

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      tabIndex={0}
      href={course.href}
      className="group/course-card block rounded-lg no-underline transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
    >
      <div className="pointer-events-auto relative flex aspect-1050/660 w-full items-center justify-center overflow-hidden rounded-lg bg-muted shadow-sm">
        <Image
          alt={`Thumbnail for ${course.title}`}
          src={course.illustration}
          width={course.illustration.width}
          height={course.illustration.height}
          sizes="(max-width: 768px) 100vw, 1050px"
          className="object-cover"
        />
      </div>
      <div>
        <h3 className="mt-4 text-base font-medium">{course.title}</h3>
        <p className="text-base leading-6 text-muted-foreground">
          {course.description}
        </p>
      </div>
    </Link>
  )
}

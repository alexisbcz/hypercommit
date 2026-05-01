import { readFile } from "node:fs/promises"
import path from "node:path"

export async function loadLessonFiles(course: string, slug: string) {
  const dir = path.join(process.cwd(), "lib", "lessons", course, slug)
  const [starter, solution] = await Promise.all([
    readFile(path.join(dir, "starter.go"), "utf8"),
    readFile(path.join(dir, "solution.go"), "utf8"),
  ])
  return { starter, solution }
}

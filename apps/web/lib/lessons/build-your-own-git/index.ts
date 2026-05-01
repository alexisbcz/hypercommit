export type LessonRound = {
  slug: string
  number: number
  title: string
  blurb: string
}

export const courseTitle = "Build your own Git"

export const rounds: readonly LessonRound[] = [
  {
    slug: "round-1",
    number: 1,
    title: "`.git` exists",
    blurb: "The smallest possible promise: `mygit init` creates a `.git` directory.",
  },
  {
    slug: "round-2",
    number: 2,
    title: "objects, refs/heads, refs/tags",
    blurb: "Lock in the canonical layout Git refuses to recognize a repo without.",
  },
  {
    slug: "round-3",
    number: 3,
    title: "HEAD points at `main`",
    blurb: "Write the symbolic ref every Git client looks for.",
  },
  {
    slug: "round-4",
    number: 4,
    title: "`config` with a `[core]` section",
    blurb: "Encode `core.repositoryformatversion` so Git stops bailing.",
  },
  {
    slug: "round-5",
    number: 5,
    title: "the success message",
    blurb: "Print the line CI scripts grep for, byte for byte.",
  },
  {
    slug: "round-6",
    number: 6,
    title: "reinit detection",
    blurb: 'Switch the message to "Reinitialized" on the second run.',
  },
  {
    slug: "round-7",
    number: 7,
    title: "preserve a user-modified HEAD",
    blurb: "Don't clobber a HEAD the user just edited.",
  },
  {
    slug: "round-8",
    number: 8,
    title: "optional `<directory>` argument",
    blurb: "`mygit init my-repo` should create `my-repo/.git`.",
  },
  {
    slug: "round-9",
    number: 9,
    title: "`--initial-branch`",
    blurb: "Make `main` the default, but let the user override it.",
  },
  {
    slug: "round-10",
    number: 10,
    title: "`--bare`",
    blurb: "No working tree; `.git` contents at the top level.",
  },
  {
    slug: "round-11",
    number: 11,
    title: "`--quiet`",
    blurb: "A no-output mode for CI pipelines.",
  },
  {
    slug: "round-12",
    number: 12,
    title: "the acid test",
    blurb: "Hand the repo to real Git. If `git status` works, you're done.",
  },
] as const

export function findRound(slug: string): LessonRound | undefined {
  return rounds.find((r) => r.slug === slug)
}

export function siblings(slug: string): {
  prev?: LessonRound
  next?: LessonRound
} {
  const i = rounds.findIndex((r) => r.slug === slug)
  return { prev: rounds[i - 1], next: rounds[i + 1] }
}

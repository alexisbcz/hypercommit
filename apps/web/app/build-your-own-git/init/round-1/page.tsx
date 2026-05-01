import type { Metadata } from "next"
import { LessonShell } from "@/components/lesson-shell"
import {
  courseTitle,
  findRound,
  rounds,
  siblings,
} from "@/lib/lessons/build-your-own-git"
import { loadLessonFiles } from "@/lib/lessons/load"

const SLUG = "round-1"
const round = findRound(SLUG)!
const { prev, next } = siblings(SLUG)

export const metadata: Metadata = {
  title: `${stripBackticks(round.title)} — ${courseTitle}`,
  description: stripBackticks(round.blurb),
}

export default async function Page() {
  const { starter, solution } = await loadLessonFiles(
    "build-your-own-git",
    SLUG
  )

  return (
    <LessonShell
      course={{ title: courseTitle, href: "/build-your-own-git/init" }}
      rounds={rounds}
      current={round}
      prev={prev}
      next={next}
      starterCode={starter}
      solutionCode={solution}
      prose={<Prose />}
    />
  )
}

function Prose() {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-foreground/85">
      <p>
        A Git repository is, at its core, a directory called <code>.git</code>{" "}
        sitting next to your working tree. Everything else Git does — staging,
        committing, branching — reads from or writes to that directory.
      </p>
      <p>
        Round 1 is the smallest promise we can make: when the user runs{" "}
        <code>mygit init</code>, a directory called <code>.git</code> appears
        in the current working directory.
      </p>

      <h2 className="mt-6 text-base font-semibold tracking-tight">The test</h2>
      <p>
        The test on the right shells out to your compiled <code>mygit</code>{" "}
        binary, runs <code>mygit init</code> inside a temp directory, then
        checks that <code>.git</code> exists and is a directory.
      </p>
      <p>
        Read it once. The whole spec for this round is{" "}
        <code>os.Stat(&quot;.git&quot;).IsDir()</code>.
      </p>

      <h2 className="mt-6 text-base font-semibold tracking-tight">Your task</h2>
      <p>
        In <code>main.go</code>, find the <code>Action</code> for the{" "}
        <code>init</code> subcommand. Replace the <code>// TODO</code> with the
        single line of code that creates the directory.
      </p>
      <p>
        <em>Hint:</em> <code>os.MkdirAll</code> with mode <code>0o755</code> is
        the same call real Git uses. <code>MkdirAll</code> is happy if the
        directory already exists, which is why we don&apos;t need an explicit
        existence check.
      </p>

      <h2 className="mt-6 text-base font-semibold tracking-tight">
        When you&apos;re green
      </h2>
      <p>
        The output panel will show:
      </p>
      <pre className="rounded border bg-muted p-3 text-xs">
        ok&nbsp;&nbsp;mygit&nbsp;&nbsp;0.5xxs
      </pre>
      <p>Hit Next to take on the canonical layout: objects, refs/heads, refs/tags.</p>
    </div>
  )
}

function stripBackticks(s: string): string {
  return s.replace(/`/g, "")
}

import { afterEach, describe, expect, test } from "bun:test"
import { spawn } from "node:child_process"
import { existsSync } from "node:fs"
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

import { rounds } from ".."

const COURSE_DIR = path.resolve(__dirname, "..")
const PER_ROUND_TIMEOUT_MS = 60_000
const RUN_TIMEOUT_MS = 45_000

type ExecResult = {
  exitCode: number
  stdout: string
  stderr: string
}

async function runGoTest(workdir: string): Promise<ExecResult> {
  return new Promise((resolve, reject) => {
    const proc = spawn("go", ["test", "./..."], {
      cwd: workdir,
      env: { ...process.env, GO111MODULE: "on" },
    })
    let stdout = ""
    let stderr = ""
    const timer = setTimeout(() => {
      proc.kill("SIGKILL")
      reject(new Error(`go test timed out after ${RUN_TIMEOUT_MS}ms`))
    }, RUN_TIMEOUT_MS)
    proc.stdout.on("data", (d) => (stdout += d.toString()))
    proc.stderr.on("data", (d) => (stderr += d.toString()))
    proc.on("error", (err) => {
      clearTimeout(timer)
      reject(err)
    })
    proc.on("close", (code) => {
      clearTimeout(timer)
      resolve({ exitCode: code ?? -1, stdout, stderr })
    })
  })
}

async function materialize(
  roundSlug: string,
  variant: "starter" | "solution"
): Promise<string> {
  const roundDir = path.join(COURSE_DIR, roundSlug)
  const [code, testGo, goMod, goSum] = await Promise.all([
    readFile(path.join(roundDir, `${variant}.go`), "utf8"),
    readFile(path.join(roundDir, "init_test.go"), "utf8"),
    readFile(path.join(roundDir, "go.mod"), "utf8"),
    readFile(path.join(roundDir, "go.sum"), "utf8"),
  ])
  const work = await mkdtemp(
    path.join(tmpdir(), `byog-${roundSlug}-${variant}-`)
  )
  await Promise.all([
    writeFile(path.join(work, "main.go"), code),
    writeFile(path.join(work, "init_test.go"), testGo),
    writeFile(path.join(work, "go.mod"), goMod),
    writeFile(path.join(work, "go.sum"), goSum),
  ])
  return work
}

describe("build-your-own-git boilerplates", () => {
  const tempdirs: string[] = []

  afterEach(async () => {
    while (tempdirs.length) {
      const d = tempdirs.pop()!
      await rm(d, { recursive: true, force: true }).catch(() => {})
    }
  })

  for (const round of rounds) {
    const roundDir = path.join(COURSE_DIR, round.slug)
    const hasStarter = existsSync(path.join(roundDir, "starter.go"))
    const hasSolution = existsSync(path.join(roundDir, "solution.go"))
    const hasTest = existsSync(path.join(roundDir, "init_test.go"))

    if (!hasStarter || !hasSolution || !hasTest) {
      // Round files not yet authored — skip with a marker so we can see the
      // gap without failing the suite.
      test.skip(`${round.slug}: files not yet authored`, () => {})
      continue
    }

    test(
      `${round.slug}: starter compiles and the test FAILS for the right reason`,
      async () => {
        const work = await materialize(round.slug, "starter")
        tempdirs.push(work)
        const res = await runGoTest(work)

        // Build errors are non-zero exit AND stderr contains compiler noise
        // ("syntax error", "undefined:", "[build failed]"). The starter is
        // allowed to fail tests but must compile.
        expect(res.stderr).not.toContain("syntax error")
        expect(res.stderr).not.toContain("undefined:")
        expect(res.stdout).not.toContain("[build failed]")

        // And the test itself must fail — otherwise the starter is already
        // solving the round, which means we have nothing to teach.
        expect(res.exitCode).not.toBe(0)
        expect(res.stdout).toContain("--- FAIL")
      },
      PER_ROUND_TIMEOUT_MS
    )

    test(
      `${round.slug}: solution compiles and the test PASSES`,
      async () => {
        const work = await materialize(round.slug, "solution")
        tempdirs.push(work)
        const res = await runGoTest(work)

        if (res.exitCode !== 0) {
          // Surface the actual failure so debugging the solution is fast.
          throw new Error(
            `solution failed (exit ${res.exitCode})\n` +
              `--- stdout ---\n${res.stdout}\n` +
              `--- stderr ---\n${res.stderr}`
          )
        }
        expect(res.stdout).toContain("ok")
        expect(res.stdout).not.toContain("FAIL")
      },
      PER_ROUND_TIMEOUT_MS
    )
  }
})

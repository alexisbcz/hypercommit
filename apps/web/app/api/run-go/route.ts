import { spawn } from "node:child_process"
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { tmpdir } from "node:os"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const COURSE = "build-your-own-git"
const ALLOWED_ROUNDS = new Set([
  "round-1",
  "round-2",
  "round-3",
  "round-4",
  "round-5",
  "round-6",
  "round-7",
  "round-8",
  "round-9",
  "round-10",
  "round-11",
  "round-12",
])

const MAX_USER_CODE_BYTES = 64 * 1024
const RUN_TIMEOUT_MS = 30_000

type RunResult = {
  ok: boolean
  exitCode: number
  stdout: string
  stderr: string
  sandbox: "smolvm" | "local"
  durationMs: number
}

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 })
  }
  const { round, userCode } = body as { round?: unknown; userCode?: unknown }

  if (typeof round !== "string" || !ALLOWED_ROUNDS.has(round)) {
    return NextResponse.json({ error: "unknown round" }, { status: 400 })
  }
  if (typeof userCode !== "string") {
    return NextResponse.json({ error: "userCode required" }, { status: 400 })
  }
  if (Buffer.byteLength(userCode, "utf8") > MAX_USER_CODE_BYTES) {
    return NextResponse.json(
      { error: `userCode exceeds ${MAX_USER_CODE_BYTES} bytes` },
      { status: 413 }
    )
  }

  const lessonDir = path.join(
    process.cwd(),
    "lib",
    "lessons",
    COURSE,
    round
  )
  let goMod: string, goSum: string, testGo: string
  try {
    ;[goMod, goSum, testGo] = await Promise.all([
      readFile(path.join(lessonDir, "go.mod"), "utf8"),
      readFile(path.join(lessonDir, "go.sum"), "utf8"),
      readFile(path.join(lessonDir, "init_test.go"), "utf8"),
    ])
  } catch (err) {
    console.error("[run-go] missing lesson files", round, err)
    return NextResponse.json(
      { error: "lesson files not found on server" },
      { status: 500 }
    )
  }

  const work = await mkdtemp(path.join(tmpdir(), `mygit-run-${round}-`))
  try {
    await Promise.all([
      writeFile(path.join(work, "main.go"), userCode),
      writeFile(path.join(work, "init_test.go"), testGo),
      writeFile(path.join(work, "go.mod"), goMod),
      writeFile(path.join(work, "go.sum"), goSum),
    ])

    const result = await runTests(work)
    return NextResponse.json(result)
  } catch (err) {
    console.error("[run-go] execution failed", err)
    return NextResponse.json(
      { error: "execution failed", detail: String(err) },
      { status: 500 }
    )
  } finally {
    rm(work, { recursive: true, force: true }).catch(() => {})
  }
}

async function runTests(workdir: string): Promise<RunResult> {
  const useSmolvm = await hasSmolvm()
  if (useSmolvm) return runInSmolvm(workdir)
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "smolvm not installed on host; refusing to execute untrusted Go in production"
    )
  }
  console.warn(
    "[run-go] smolvm not on PATH — falling back to local `go test`. " +
      "Install smolvm before deploying."
  )
  return runLocal(workdir)
}

let smolvmCache: boolean | undefined
async function hasSmolvm(): Promise<boolean> {
  if (smolvmCache !== undefined) return smolvmCache
  smolvmCache = await new Promise<boolean>((resolve) => {
    const p = spawn("smolvm", ["--version"], { stdio: "ignore" })
    p.on("error", () => resolve(false))
    p.on("close", (code) => resolve(code === 0))
  })
  return smolvmCache
}

function runInSmolvm(workdir: string): Promise<RunResult> {
  return execCapture(
    "smolvm",
    [
      "machine",
      "run",
      "--net",
      "--image",
      "golang:1.22-alpine",
      "--volume",
      `${workdir}:/work`,
      "--",
      "sh",
      "-c",
      "cd /work && go test ./... 2>&1",
    ],
    "smolvm"
  )
}

function runLocal(workdir: string): Promise<RunResult> {
  return execCapture("go", ["test", "./..."], "local", workdir)
}

function execCapture(
  cmd: string,
  args: string[],
  sandbox: "smolvm" | "local",
  cwd?: string
): Promise<RunResult> {
  return new Promise((resolve) => {
    const start = Date.now()
    const proc = spawn(cmd, args, {
      cwd,
      env: { ...process.env, GO111MODULE: "on" },
    })
    let stdout = ""
    let stderr = ""
    const timer = setTimeout(() => proc.kill("SIGKILL"), RUN_TIMEOUT_MS)
    proc.stdout.on("data", (d) => (stdout += d.toString()))
    proc.stderr.on("data", (d) => (stderr += d.toString()))
    proc.on("close", (code) => {
      clearTimeout(timer)
      resolve({
        ok: code === 0,
        exitCode: code ?? -1,
        stdout,
        stderr,
        sandbox,
        durationMs: Date.now() - start,
      })
    })
    proc.on("error", (err) => {
      clearTimeout(timer)
      resolve({
        ok: false,
        exitCode: -1,
        stdout: "",
        stderr: String(err),
        sandbox,
        durationMs: Date.now() - start,
      })
    })
  })
}

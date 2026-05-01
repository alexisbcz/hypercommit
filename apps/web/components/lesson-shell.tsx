"use client"

import * as React from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { useTheme } from "next-themes"
import { Button } from "@workspace/ui/components/button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@workspace/ui/components/resizable"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"
import { cn } from "@workspace/ui/lib/utils"
import type { LessonRound } from "@/lib/lessons/build-your-own-git"

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      Loading editor…
    </div>
  ),
})

type RunResponse = {
  ok: boolean
  exitCode: number
  stdout: string
  stderr: string
  sandbox: "smolvm" | "local"
  durationMs: number
}

export type LessonShellProps = {
  course: { title: string; href: string }
  rounds: readonly LessonRound[]
  current: LessonRound
  prev?: LessonRound
  next?: LessonRound
  starterCode: string
  solutionCode: string
  prose: React.ReactNode
}

// Cheap, deterministic 32-bit hash. Used to version the localStorage key by
// the canonical starter, so editing starter.go on disk invalidates any code
// the user (or a stale dev session) had cached for the previous starter.
function hashStarter(s: string): string {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0).toString(36)
}

const storageKey = (slug: string, starter: string) =>
  `byog:${slug}:v=${hashStarter(starter)}:code`

export function LessonShell({
  course,
  rounds,
  current,
  prev,
  next,
  starterCode,
  solutionCode,
  prose,
}: LessonShellProps) {
  const [code, setCode] = React.useState(starterCode)
  const [output, setOutput] = React.useState<RunResponse | null>(null)
  const [running, setRunning] = React.useState(false)
  const hydratedRef = React.useRef(false)
  const isStarter = code === starterCode
  const isSolution = code === solutionCode
  const editorTheme = useEditorTheme()

  // Hydrate from localStorage on mount and on slug change. setState-in-effect
  // is the correct shape here: the source of truth is the browser's
  // localStorage, which doesn't exist during SSR, so we deliberately render
  // once with starterCode then sync. The persistence effect below is gated on
  // `hydratedRef` so it doesn't echo this initial sync back to disk.
  React.useLayoutEffect(() => {
    hydratedRef.current = false
    const saved = window.localStorage.getItem(storageKey(current.slug, starterCode))
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCode(saved ?? starterCode)
    queueMicrotask(() => {
      hydratedRef.current = true
    })
  }, [current.slug, starterCode])

  React.useEffect(() => {
    if (!hydratedRef.current) return
    window.localStorage.setItem(storageKey(current.slug, starterCode), code)
  }, [current.slug, code, starterCode])

  async function run() {
    setRunning(true)
    setOutput(null)
    try {
      const res = await fetch("/api/run-go", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ round: current.slug, userCode: code }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setOutput({
          ok: false,
          exitCode: -1,
          stdout: "",
          stderr: err.error || `HTTP ${res.status}`,
          sandbox: "local",
          durationMs: 0,
        })
        return
      }
      const data: RunResponse = await res.json()
      setOutput(data)
    } catch (err) {
      setOutput({
        ok: false,
        exitCode: -1,
        stdout: "",
        stderr: String(err),
        sandbox: "local",
        durationMs: 0,
      })
    } finally {
      setRunning(false)
    }
  }

  function reset() {
    setCode(starterCode)
    window.localStorage.removeItem(storageKey(current.slug, starterCode))
    setOutput(null)
  }

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault()
        if (!running) run()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, running])

  return (
    <SidebarProvider
      style={{ "--sidebar-width": "16rem" } as React.CSSProperties}
    >
      <Sidebar>
        <SidebarHeader>
          <Link
            href={course.href}
            className="text-sm font-semibold tracking-tight"
          >
            {course.title}
          </Link>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Progress</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${(current.number / rounds.length) * 100}%`,
                }}
              />
            </div>
            <span className="text-xs text-muted-foreground tabular-nums">
              {current.number}/{rounds.length}
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Rounds</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {rounds.map((r) => (
                  <SidebarMenuItem key={r.slug}>
                    <SidebarMenuButton
                      isActive={r.slug === current.slug}
                      render={<Link href={`${course.href}/${r.slug}`} />}
                    >
                      <span
                        className={cn(
                          "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] tabular-nums",
                          r.slug === current.slug
                            ? "border-primary/50 text-primary"
                            : "border-border text-muted-foreground"
                        )}
                      >
                        {r.number}
                      </span>
                      <span className="truncate">
                        {stripBackticks(r.title)}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <p className="text-xs text-muted-foreground">
            Cmd/Ctrl+Enter to run.
          </p>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="h-svh overflow-hidden">
        <ResizablePanelGroup orientation="horizontal" className="h-full">
          <ResizablePanel defaultSize={42} minSize={28}>
            <div className="flex h-full flex-col overflow-hidden">
              <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-2">
                <SidebarTrigger />
                <span className="text-xs font-medium text-muted-foreground">
                  Round {current.number} of {rounds.length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="mb-6">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    {stripBackticks(current.title)}
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {stripBackticks(current.blurb)}
                  </p>
                </div>
                <div className="prose prose-sm max-w-none">{prose}</div>
              </div>
              <div className="flex shrink-0 items-center justify-between border-t border-border px-6 py-3">
                {prev ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    nativeButton={false}
                    render={<Link href={`${course.href}/${prev.slug}`} />}
                  >
                    ← Previous
                  </Button>
                ) : (
                  <span />
                )}
                {next ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    nativeButton={false}
                    render={<Link href={`${course.href}/${next.slug}`} />}
                  >
                    Next →
                  </Button>
                ) : (
                  <span />
                )}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={58} minSize={30}>
            <div className="flex h-full flex-col overflow-hidden">
              <div className="flex shrink-0 items-center gap-2 border-b border-border bg-card px-4 py-2">
                <Button
                  onClick={run}
                  disabled={running}
                  data-testid="run-button"
                >
                  {running ? "Running…" : "Run"}
                  <kbd className="ml-1.5 font-sans text-[10px] opacity-60">
                    Ctrl+↵
                  </kbd>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCode(solutionCode)}
                  disabled={isSolution}
                  title="Replace your code with the reference solution"
                >
                  Load Solution
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={reset}
                  disabled={isStarter}
                >
                  Reset to Starter
                </Button>
                <div className="flex-1" />
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                    isSolution
                      ? "bg-primary/10 text-primary"
                      : isStarter
                        ? "bg-muted text-muted-foreground"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  )}
                >
                  {isSolution
                    ? "solution"
                    : isStarter
                      ? "starter"
                      : "edited"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {output
                    ? output.ok
                      ? `pass · ${output.sandbox} · ${output.durationMs}ms`
                      : `fail · ${output.sandbox} · ${output.durationMs}ms`
                    : "ready"}
                </span>
              </div>

              <div className="relative min-h-0 flex-1">
                <ResizablePanelGroup orientation="vertical" className="h-full">
                  <ResizablePanel defaultSize={70} minSize={20}>
                    <Editor
                      height="100%"
                      defaultLanguage="go"
                      language="go"
                      value={code}
                      onChange={(v) => setCode(v ?? "")}
                      theme={editorTheme}
                      options={{
                        fontSize: 13,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                      }}
                    />
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={30} minSize={10}>
                    <div className="h-full overflow-auto bg-muted">
                      <OutputPane output={output} running={running} />
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </SidebarInset>
    </SidebarProvider>
  )
}

function OutputPane({
  output,
  running,
}: {
  output: RunResponse | null
  running: boolean
}) {
  if (running) {
    return (
      <pre className="p-4 font-mono text-sm text-muted-foreground">
        Running tests…
      </pre>
    )
  }
  if (!output) {
    return (
      <pre className="p-4 font-mono text-sm text-muted-foreground">
        Click &quot;Run&quot; to execute the tests.
      </pre>
    )
  }

  // `go test` writes test results to stdout but build/compiler errors to
  // stderr. A "[build failed]" line on stdout means the real diagnostics are
  // on stderr, so always show both streams when present, stderr first when
  // the run failed (compiler errors are what the user needs to read).
  const stdout = output.stdout.trimEnd()
  const stderr = output.stderr.trimEnd()
  const segments: { label: string; body: string; tone: "err" | "out" }[] = []
  if (!output.ok && stderr) {
    segments.push({ label: "stderr", body: stderr, tone: "err" })
    if (stdout) segments.push({ label: "stdout", body: stdout, tone: "out" })
  } else {
    if (stdout) segments.push({ label: "stdout", body: stdout, tone: "out" })
    if (stderr) segments.push({ label: "stderr", body: stderr, tone: "err" })
  }
  if (segments.length === 0) {
    segments.push({
      label: "stdout",
      body: `(no output, exit ${output.exitCode})`,
      tone: "out",
    })
  }

  return (
    <div className="font-mono text-sm">
      {segments.map((s, i) => (
        <div key={s.label} className={cn(i > 0 && "border-t border-border")}>
          <div className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
            {s.label}
          </div>
          <pre
            className={cn(
              "px-4 pb-3 whitespace-pre-wrap",
              s.tone === "err" && !output.ok ? "text-destructive" : "text-foreground"
            )}
          >
            {s.body}
          </pre>
        </div>
      ))}
    </div>
  )
}

function stripBackticks(s: string): string {
  return s.replace(/`/g, "")
}

// Map next-themes' resolved theme to a Monaco built-in theme. We use
// useSyncExternalStore for the mount gate so the SSR snapshot is stable
// (vs-dark) and the client switches to the actual resolvedTheme on hydrate
// without a setState-in-effect.
function useEditorTheme(): "vs" | "vs-dark" {
  const { resolvedTheme } = useTheme()
  const mounted = React.useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  )
  if (!mounted) return "vs-dark"
  return resolvedTheme === "light" ? "vs" : "vs-dark"
}

function subscribeNoop(): () => void {
  return () => {}
}

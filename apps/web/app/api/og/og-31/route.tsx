import { ImageResponse } from "next/og"
import { cn } from "@workspace/ui/lib/utils"

export const runtime = "edge"

const geistFont = fetch(
  "https://github.com/vercel/geist-font/raw/main/packages/next/dist/fonts/geist-sans/Geist-Medium.ttf"
).then((res) => res.arrayBuffer())

export async function GET(req: Request) {
  const fontData = await geistFont
  const url = new URL(req.url)
  const values = Object.fromEntries(url.searchParams)
  const mode = (values.mode || "light") as "dark" | "light"

  const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="50" height="50"><defs><linearGradient id="g" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#bae6fd"/><stop offset="0.5" stop-color="#0284c7"/><stop offset="1" stop-color="#082f49"/></linearGradient></defs><circle cx="200" cy="200" r="200" fill="url(#g)"/></svg>`
  const logoSrc = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString("base64")}`

  return new ImageResponse(
    (
      <div
        tw={cn(
          "flex h-full w-full flex-col items-center justify-center px-36",
          mode === "dark"
            ? "bg-neutral-900 text-white"
            : "bg-neutral-50 text-black"
        )}
      >
        <div
          tw={cn(
            "relative flex w-full flex-col items-center justify-center py-14 shadow-md",
            mode === "dark"
              ? "bg-black shadow-neutral-900/50"
              : "bg-white shadow-neutral-100"
          )}
        >
          <div
            tw={cn(
              "absolute -inset-y-24 -left-px w-px",
              mode === "dark" ? "bg-neutral-700" : "bg-neutral-200"
            )}
          />
          <div
            tw={cn(
              "absolute -inset-y-24 -right-px w-px",
              mode === "dark" ? "bg-neutral-700" : "bg-neutral-200"
            )}
          />
          <div
            tw={cn(
              "absolute -inset-x-24 -top-px h-px",
              mode === "dark" ? "bg-neutral-700" : "bg-neutral-200"
            )}
          />
          <div
            tw={cn(
              "absolute -inset-x-24 -bottom-px h-px",
              mode === "dark" ? "bg-neutral-700" : "bg-neutral-200"
            )}
          />

          <div tw="flex items-center justify-center">
            <img alt="Hypercommit" height={50} src={logoSrc} width={50} />
            <span tw="ml-6 text-5xl font-medium tracking-tighter">
              Hypercommit
            </span>
          </div>
          <p
            tw={cn(
              "mx-auto mt-10 max-w-2xl text-center text-3xl leading-[1.3] tracking-tight",
              mode === "dark" ? "text-neutral-400/80" : "text-neutral-500/80"
            )}
          >
            Level up as a software engineer, one commit at a time.
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Geist",
          data: fontData,
          style: "normal",
          weight: 500,
        },
      ],
    }
  )
}

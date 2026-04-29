"use client";

import * as React from "react";
import { defineSound } from "@web-kits/audio";

const playPop = defineSound({
  source: { type: "sine", frequency: { start: 400, end: 150 } },
  envelope: { decay: 0.05 },
  gain: 0.35,
});

export function useCopyToClipboard({
  timeout = 2000,
  onCopy,
}: {
  timeout?: number;
  onCopy?: () => void;
} = {}) {
  const [isCopied, setIsCopied] = React.useState(false);

  const copyToClipboard = (value: string) => {
    if (typeof window === "undefined" || !navigator.clipboard.writeText) {
      return;
    }

    if (!value) return;

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);

      try {
        playPop();
      } catch {
        // ignore playback errors (autoplay policy, AudioContext, etc.)
      }

      if (onCopy) {
        onCopy();
      }

      setTimeout(() => {
        setIsCopied(false);
      }, timeout);
    }, console.error);
  };

  return { isCopied, copyToClipboard };
}

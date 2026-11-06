"use client";

import { useCallback, useSyncExternalStore } from "react";
import { copyText } from "@/lib/device-actions";
import fleet from "@/lib/fleet.json";

const storageKey = "cartime-shortlist";
const changeEvent = "cartime-shortlist-change";
export const SHORTLIST_LIMIT = 3;
const knownIds = new Set(fleet.map((car) => car.id));
const empty: string[] = [];

let cachedRaw: string | null = null;
let cachedIds: string[] = empty;

function read(): string[] {
  let raw: string | null = null;
  try { raw = localStorage.getItem(storageKey); } catch { return empty; }
  if (raw === cachedRaw) return cachedIds;
  cachedRaw = raw;
  try {
    const parsed: unknown = JSON.parse(raw ?? "[]");
    cachedIds = Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string" && knownIds.has(id)).slice(0, SHORTLIST_LIMIT) : empty;
  } catch { cachedIds = empty; }
  return cachedIds;
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(changeEvent, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(changeEvent, onChange);
  };
}

export function saveShortlist(ids: string[]) {
  const next = ids.filter((id) => knownIds.has(id)).slice(0, SHORTLIST_LIMIT);
  try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* Private mode: the list lasts only as long as the state. */ }
  window.dispatchEvent(new Event(changeEvent));
}

/** Cars chosen for comparison. Kept in this browser only. */
export function useShortlist() {
  const ids = useSyncExternalStore(subscribe, read, () => empty);
  const toggle = useCallback((id: string) => {
    const current = read();
    if (current.includes(id)) saveShortlist(current.filter((item) => item !== id));
    else saveShortlist([...current.slice(-(SHORTLIST_LIMIT - 1)), id]);
  }, []);
  return { ids, toggle };
}

/** Uses the phone's share sheet when there is one, otherwise copies the link. */
export async function shareLink(url: string, title: string): Promise<"shared" | "copied" | "failed"> {
  if (typeof navigator.share === "function" && window.matchMedia("(pointer: coarse)").matches) {
    try {
      await navigator.share({ url, title });
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return "shared";
      // Share refused, as some in-app browsers do: copy the link instead.
    }
  }
  return await copyText(url) ? "copied" : "failed";
}

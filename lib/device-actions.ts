/**
 * Copying and saving that survive phones and in-app browsers (WhatsApp, Telegram, Instagram, ChatGPT).
 * Those browsers often block the clipboard API and ignore download links, so each action tries
 * the best method first and says honestly whether it worked, so the page can offer another way.
 */

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Blocked by the browser: try the older way below.
  }
  // A selected span works on iOS too, and does not bring up the keyboard as a text field would.
  const holder = document.createElement("span");
  holder.textContent = text;
  holder.style.cssText = "position:fixed;top:0;left:0;white-space:pre;opacity:0;font-size:16px;-webkit-user-select:all;user-select:all";
  document.body.appendChild(holder);
  const selection = window.getSelection();
  let copied = false;
  try {
    const range = document.createRange();
    range.selectNodeContents(holder);
    selection?.removeAllRanges();
    selection?.addRange(range);
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }
  selection?.removeAllRanges();
  holder.remove();
  return copied;
}

export type FileResult = "shared" | "downloaded" | "cancelled";

/** Must run inside a tap: phones allow the share sheet only as a direct response to one. */
export async function saveFile(blob: Blob, name: string): Promise<FileResult> {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (coarse && typeof navigator.canShare === "function") {
    const file = new File([blob], name, { type: blob.type });
    if (navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: name });
        return "shared";
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
        // Share refused: fall through to a normal download.
      }
    }
  }
  downloadFile(blob, name);
  return "downloaded";
}

export function downloadFile(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.rel = "noopener";
  link.style.display = "none";
  // iOS Safari needs the link in the page, and time to read the file before it is released.
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

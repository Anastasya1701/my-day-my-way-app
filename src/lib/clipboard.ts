/**
 * Copies from a visible textarea, falling back to the async Clipboard API.
 * Returns false only when neither route worked, so the UI can ask the user
 * to copy by hand — the MVP's behaviour.
 */
export function copyFromTextarea(el: HTMLTextAreaElement): boolean {
  el.focus();
  el.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  if (!ok && navigator.clipboard) {
    void navigator.clipboard.writeText(el.value);
    ok = true;
  }
  return ok;
}

/** Same, for text that is not already on screen. */
export function copyText(text: string): boolean {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  const ok = copyFromTextarea(ta);
  document.body.removeChild(ta);
  return ok;
}

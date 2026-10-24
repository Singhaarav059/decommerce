/** A title used mid-sentence: lowercase its first letter unless the first word is an acronym (B2B, POS, OMS). */
export function inSentence(title: string) {
  const first = title.split(/[\s-]/)[0];
  return /[A-Z0-9].*[A-Z0-9]/.test(first) ? title : title.charAt(0).toLowerCase() + title.slice(1);
}

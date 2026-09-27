export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

/** Sanitizes React's useId output so it can be used inside SVG url(#id) references. */
export function svgId(id: string) {
  return `svg${id.replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

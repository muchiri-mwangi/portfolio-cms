export type ContentSegment =
  | { type: "markdown"; value: string }
  | { type: "products"; categorySlug: string; limit: number };

const EMBED_PATTERN = /\[\[products:([a-z0-9-]+)(?::(\d+))?\]\]/gi;

// Authors write `[[products:ai-tools]]` (optionally `[[products:ai-tools:6]]`
// to change the count) anywhere in a post's Markdown to drop in a live grid
// of that marketplace category's products.
export function parsePostContent(content: string): ContentSegment[] {
  const segments: ContentSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  EMBED_PATTERN.lastIndex = 0;
  while ((match = EMBED_PATTERN.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "markdown", value: content.slice(lastIndex, match.index) });
    }
    segments.push({
      type: "products",
      categorySlug: match[1],
      limit: match[2] ? Number(match[2]) : 3,
    });
    lastIndex = EMBED_PATTERN.lastIndex;
  }

  if (lastIndex < content.length) {
    segments.push({ type: "markdown", value: content.slice(lastIndex) });
  }

  return segments;
}

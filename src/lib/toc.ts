import GithubSlugger from "github-slugger";

export type Heading = { id: string; text: string; level: 2 | 3 };

// Same slugging library rehype-slug uses internally, run in the same
// top-to-bottom order, so the ids we generate here match the ids
// rehype-slug injects into the rendered headings — that's what makes the
// TOC links actually jump to (and scrollspy actually track) the right spot.
export function extractHeadings(markdown: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];

  for (const line of markdown.split("\n")) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!match) continue;
    const level = match[1].length as 2 | 3;
    const text = match[2].trim();
    headings.push({ id: slugger.slug(text), text, level });
  }

  return headings;
}

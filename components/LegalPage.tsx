import Link from "next/link";

export type LegalDoc = { lang: "EN" | "RU"; label: string; text: string };

/**
 * Readable shell for legal documents. Renders each language version verbatim
 * — same words, same paragraph breaks — as an exact copy of the app's
 * assets/legal/*.txt (the single source of truth). The only liberty taken is
 * visual: numbered section lines ("1. Data that stays on your device only")
 * render as subheadings, the effective-date line surfaces under the H1
 * instead of as a body paragraph, and bare URLs become clickable links.
 */
export default function LegalPage({ title, docs }: { title: string; docs: LegalDoc[] }) {
  return (
    <main className="min-h-screen bg-ink px-6 py-16">
      <article className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-8 inline-block cursor-pointer font-body text-sm text-muted transition-colors hover:text-paper"
        >
          ← Arcanum
        </Link>

        <h1 className="font-display text-4xl font-medium text-paper">{title}</h1>

        {docs.length > 1 && (
          <nav className="mt-6 flex gap-3 font-body text-sm">
            {docs.map((d) => (
              <a
                key={d.lang}
                href={`#${d.lang.toLowerCase()}`}
                className="cursor-pointer rounded-lg border border-white/10 px-3 py-1 text-muted transition-colors hover:border-gold/50 hover:text-paper"
              >
                {d.label}
              </a>
            ))}
          </nav>
        )}

        {docs.map((d) => {
          const { effectiveDate, blocks } = parseLegalDoc(d.text);
          return (
            <section key={d.lang} id={d.lang.toLowerCase()} className="mt-12">
              {docs.length > 1 && (
                <p className="mb-2 font-body text-xs uppercase tracking-[0.3em] text-gold-light">
                  {d.label}
                </p>
              )}
              {effectiveDate && (
                <p className="mb-8 font-body text-sm text-muted">{effectiveDate}</p>
              )}
              <div className="font-body">
                {blocks.map((block, i) =>
                  block.type === "heading" ? (
                    <h2
                      key={i}
                      className="mb-3 mt-10 font-display text-xl font-medium text-paper first:mt-0"
                    >
                      {block.text}
                    </h2>
                  ) : (
                    <p
                      key={i}
                      className="mb-5 whitespace-pre-line text-sm leading-relaxed text-muted"
                    >
                      {linkify(block.text)}
                    </p>
                  ),
                )}
              </div>
            </section>
          );
        })}
      </article>
    </main>
  );
}

type Block = { type: "heading" | "body"; text: string };

const EFFECTIVE_DATE_RE = /^(Effective date|Дата вступления в силу):\s*(.+)$/i;
const SECTION_HEADING_RE = /^\d+\.\s+\S/;

// Parses the plain-text doc into an effective-date line (shown under the H1)
// and a sequence of heading/body blocks. The document's own title line
// ("PRIVACY POLICY" / "ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ") is dropped since the
// page already shows it as the H1 — everything else renders unchanged.
function parseLegalDoc(text: string): { effectiveDate: string | null; blocks: Block[] } {
  const paragraphs = splitParagraphs(text);
  if (paragraphs.length === 0) return { effectiveDate: null, blocks: [] };

  const [, ...rest] = paragraphs; // drop the redundant title line
  let effectiveDate: string | null = null;
  let body = rest;
  if (rest.length > 0 && EFFECTIVE_DATE_RE.test(rest[0])) {
    effectiveDate = rest[0];
    body = rest.slice(1);
  }

  const blocks: Block[] = body.map((p) => ({
    type: SECTION_HEADING_RE.test(p) ? "heading" : "body",
    text: p,
  }));

  return { effectiveDate, blocks };
}

function splitParagraphs(text: string): string[] {
  return text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// Bare domain+path references in the legal text (e.g. "revenuecat.com/privacy",
// "policies.google.com/privacy") turned into clickable links. The source text
// never includes a protocol, so we add https:// on the href only. Deliberately
// narrow character class (letters/digits/hyphens/slashes only): these URLs sit
// right up against sentence punctuation with no space, e.g.
// "...revenuecat.com/privacy);" — a wider class (allowing parens/semicolons)
// would swallow the closing "); " into the href.
const URL_RE = /((?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[a-z0-9-]+)+)/gi;

function linkify(text: string): React.ReactNode[] {
  const parts = text.split(URL_RE);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <a
        key={i}
        href={`https://${part}`}
        target="_blank"
        rel="noopener noreferrer"
        className="cursor-pointer text-paper underline decoration-muted/50 underline-offset-2 transition-colors hover:decoration-paper"
      >
        {part}
      </a>
    ) : (
      part
    ),
  );
}

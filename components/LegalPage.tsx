import Link from "next/link";

export type LegalDoc = { lang: "EN" | "RU"; label: string; text: string };

/**
 * Readable shell for legal documents. Each language version is rendered
 * verbatim from the app's assets/legal/*.txt (the single source of truth):
 * same words, same order. The plain-text conventions of those files map to
 * markup like this:
 *   - first line               -> document title (h1 for the first document)
 *   - "Effective date…" line   -> caption right under the title
 *   - "N. Heading" line        -> h2
 *   - lines starting with "- " -> <li> of a list, after their intro line
 *   - "Name. Rest of text"     -> paragraph with the name emphasised
 *   - support e-mail           -> mailto link; bare domain/path -> new-tab link
 */
export default function LegalPage({ docs }: { docs: LegalDoc[] }) {
  const parsed = docs.map((d) => ({ doc: d, ...parseLegalDoc(d.text) }));
  const first = parsed[0];

  return (
    <main className="min-h-screen bg-ink px-6 py-16">
      <article className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-8 inline-block cursor-pointer font-body text-sm text-muted transition-colors hover:text-paper"
        >
          ← Arcanum
        </Link>

        <h1
          lang={first.doc.lang.toLowerCase()}
          className="break-words font-display text-2xl font-medium text-paper sm:text-4xl"
        >
          {first.title}
        </h1>

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

        {parsed.map(({ doc, title, effectiveDate, blocks }, idx) => (
          <section
            key={doc.lang}
            id={doc.lang.toLowerCase()}
            lang={doc.lang.toLowerCase()}
            className="mt-12"
          >
            {docs.length > 1 && (
              <p className="mb-2 font-body text-xs uppercase tracking-[0.3em] text-gold-light">
                {doc.label}
              </p>
            )}
            {/* The first document's title is the page h1 above; the others
                carry their own title here, styled the same way. */}
            {idx > 0 && (
              <h2 className="mb-2 break-words font-display text-2xl font-medium text-paper sm:text-4xl">
                {title}
              </h2>
            )}
            {effectiveDate && (
              <p className="mb-8 font-body text-sm text-muted">{effectiveDate}</p>
            )}
            <div className="font-body">
              {blocks.map((block, i) => {
                if (block.type === "heading") {
                  return (
                    <h2
                      key={i}
                      className="mb-3 mt-10 font-display text-xl font-medium text-paper first:mt-0"
                    >
                      {block.text}
                    </h2>
                  );
                }
                const hasItems = block.items.length > 0;
                return (
                  <div key={i}>
                    <p
                      className={`${hasItems ? "mb-2" : "mb-5"} whitespace-pre-line text-sm leading-relaxed text-muted`}
                    >
                      {block.lead && (
                        <>
                          <strong className="font-medium text-paper">{block.lead}</strong>{" "}
                        </>
                      )}
                      {linkify(block.text)}
                    </p>
                    {hasItems && (
                      <ul className="mb-5 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted marker:text-muted/60">
                        {block.items.map((item, j) => (
                          <li key={j}>{linkify(item)}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </article>
    </main>
  );
}

type Block =
  | { type: "heading"; text: string }
  | { type: "body"; lead: string | null; text: string; items: string[] };

const EFFECTIVE_DATE_RE = /^(Effective date|Дата вступления в силу):\s*(.+)$/i;
const SECTION_HEADING_RE = /^\d+\.\s+\S/;

// Paragraphs that open with a short name and a full stop ("Entry tagging. …").
// An explicit list, not a "short first sentence" heuristic: the latter would
// also catch ordinary openers like "Welcome to Arcanum." in the Terms. If the
// app texts gain another named paragraph, add its name here.
const LEAD_INS = [
  "Entry tagging.",
  "Full archetype analysis.",
  "Book page.",
  "Diary export and restore.",
  "Разметка записей.",
  "Полный разбор архетипа.",
  "Страница книги.",
  "Экспорт и восстановление дневника.",
];

// Splits the plain-text document into title, effective-date caption and a flat
// list of heading/body blocks. Nothing is dropped or reworded.
function parseLegalDoc(text: string): {
  title: string;
  effectiveDate: string | null;
  blocks: Block[];
} {
  const paragraphs = splitParagraphs(text);
  if (paragraphs.length === 0) return { title: "", effectiveDate: null, blocks: [] };

  const [title, ...rest] = paragraphs;
  let effectiveDate: string | null = null;
  let body = rest;
  if (rest.length > 0 && EFFECTIVE_DATE_RE.test(rest[0])) {
    effectiveDate = rest[0];
    body = rest.slice(1);
  }

  const blocks: Block[] = body.map((p) => {
    if (!p.includes("\n") && SECTION_HEADING_RE.test(p)) {
      return { type: "heading", text: p };
    }
    const lines = p.split("\n");
    const firstBullet = lines.findIndex((l) => l.startsWith("- "));
    const intro = (firstBullet === -1 ? lines : lines.slice(0, firstBullet)).join("\n");
    const items = firstBullet === -1 ? [] : lines.slice(firstBullet).map((l) => l.replace(/^- /, ""));

    const lead = LEAD_INS.find((l) => intro.startsWith(l + " ")) ?? null;
    return {
      type: "body",
      lead,
      text: lead ? intro.slice(lead.length + 1) : intro,
      items,
    };
  });

  return { title, effectiveDate, blocks };
}

function splitParagraphs(text: string): string[] {
  return text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// Links inside running text. Two kinds, matched in one pass:
//  - e-mail addresses            -> mailto: link
//  - bare domain/path references -> https:// link in a new tab. The source
//    never includes a protocol, so it is added on the href only. The character
//    class is deliberately narrow (letters/digits/hyphens/slashes): these URLs
//    sit right against sentence punctuation with no space, e.g.
//    "...revenuecat.com/privacy);" — a wider class would swallow the "); ".
const LINK_RE =
  /([a-z0-9._%+-]+@(?:[a-z0-9-]+\.)+[a-z]{2,})|((?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[a-z0-9-]+)+)/gi;

const LINK_CLASS =
  "cursor-pointer text-paper underline decoration-muted/50 underline-offset-2 transition-colors hover:decoration-paper";

function linkify(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(LINK_RE)) {
    const start = m.index ?? 0;
    if (start > last) out.push(text.slice(last, start));
    if (m[1]) {
      out.push(
        <a key={key++} href={`mailto:${m[1]}`} className={LINK_CLASS}>
          {m[1]}
        </a>,
      );
    } else {
      out.push(
        <a
          key={key++}
          href={`https://${m[2]}`}
          target="_blank"
          rel="noopener noreferrer"
          className={LINK_CLASS}
        >
          {m[2]}
        </a>,
      );
    }
    last = start + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

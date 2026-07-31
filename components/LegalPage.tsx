import Link from "next/link";

export type LegalDoc = { lang: "EN" | "RU"; label: string; text: string };

/**
 * Readable shell for legal documents. Renders each language version verbatim
 * (paragraphs split on blank lines, whitespace preserved) so the text stays an
 * exact copy of the app's assets/legal/*.txt — the single source of truth.
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

        {docs.map((d) => (
          <section key={d.lang} id={d.lang.toLowerCase()} className="mt-12">
            {docs.length > 1 && (
              <p className="mb-6 text-xs uppercase tracking-[0.3em] text-gold-light">{d.label}</p>
            )}
            <div className="space-y-5 font-body text-sm leading-relaxed text-paper/85">
              {splitParagraphs(d.text).map((p, i) => (
                <p key={i} className="whitespace-pre-line">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </article>
    </main>
  );
}

function splitParagraphs(text: string): string[] {
  return text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean);
}

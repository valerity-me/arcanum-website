// Bottom of the home page: the same legal line as at the foot of the first
// screen (policy, terms, support address, company).
export default function LegalFooter() {
  return (
    <footer
      className="relative z-10 border-t border-paper/[0.08] bg-ink px-4 pt-6 font-body text-xs text-muted sm:px-6 md:px-12"
      style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <a href="/privacy/" className="cursor-pointer transition-colors hover:text-paper">
          Privacy Policy
        </a>
        <a href="/terms/" className="cursor-pointer transition-colors hover:text-paper">
          Terms of Use
        </a>
        <a
          href="mailto:support@arcanum.garden"
          className="cursor-pointer transition-colors hover:text-paper"
        >
          support@arcanum.garden
        </a>
      </div>
      <p className="mt-2 max-w-2xl text-[11px] leading-relaxed text-muted">
        © {new Date().getFullYear()} VO Digital — a sole proprietorship registered in the Republic
        of Kazakhstan. For entertainment and self-reflection.
      </p>
    </footer>
  );
}

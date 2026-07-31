import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink px-6 py-14 text-muted">
      <div className="mx-auto flex max-w-content flex-col items-center gap-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-display text-lg text-paper">Arcanum</p>
          <p className="mt-1 font-body text-sm">
            by Aeternum ·{" "}
            <a className="cursor-pointer hover:text-paper" href="mailto:valerity.me@gmail.com">
              valerity.me@gmail.com
            </a>
          </p>
          {/* DSA trader details go here once confirmed by Valery (address / phone / email). */}
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-body text-sm">
          <Link className="cursor-pointer hover:text-paper" href="/privacy">
            Privacy Policy
          </Link>
          <Link className="cursor-pointer hover:text-paper" href="/terms">
            Terms of Use
          </Link>
        </nav>
      </div>

      <p className="mx-auto mt-10 max-w-content text-center font-body text-xs text-muted">
        © {new Date().getFullYear()} VO Digital — a sole proprietorship registered in the Republic of
        Kazakhstan. For entertainment and self-reflection.
      </p>
    </footer>
  );
}

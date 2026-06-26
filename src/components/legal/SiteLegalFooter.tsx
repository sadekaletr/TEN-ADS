import Link from "next/link";

export function SiteLegalFooter() {
  return (
    <footer className="border-t border-gold-4/15 bg-void/80 px-4 py-6 text-center text-xs text-dim">
      <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <Link href="/privacy" className="hover:text-gold-1">
          سياسة الخصوصية
        </Link>
        <span className="text-gold-4/40" aria-hidden>
          |
        </span>
        <Link href="/terms" className="hover:text-gold-1">
          شروط الاستخدام
        </Link>
      </nav>
      <p className="mt-2 text-dimmer">© TENEGTA Spark</p>
    </footer>
  );
}

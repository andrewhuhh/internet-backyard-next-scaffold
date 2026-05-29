import Link from "next/link";

const nav = [
  { href: "/brief", label: "Brief" },
  { href: "/explorations", label: "Explorations" },
  { href: "/primitive", label: "Primitive" },
];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0c0b] text-[#f2ebe0]">
      <div className="border-b border-[#2a2e2c] bg-[#0d100e] px-4 py-2 font-mono text-[11px] text-[#8f8a7e] sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
          <span>IBY_DESK · prototype · env:demo</span>
          <span className="text-[#c49a6c]">CURSOR_TRACK</span>
        </div>
      </div>
      <header className="border-b border-[#2a2e2c] px-4 py-5 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
          <Link href="/" className="group">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8f8a7e]">
              Internet Backyard
            </div>
            <div className="mt-1 text-lg font-semibold tracking-tight text-[#f2ebe0] group-hover:text-[#e8d5c0]">
              Settlement desk
            </div>
          </Link>
          <nav className="flex flex-wrap gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md border border-transparent px-3 py-1.5 font-mono text-xs text-[#a39e90] transition hover:border-[#3a4038] hover:bg-[#141816] hover:text-[#f2ebe0]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 sm:px-8">{children}</div>
    </div>
  );
}

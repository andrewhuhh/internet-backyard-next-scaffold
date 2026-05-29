import Link from "next/link";
import { SiteChrome } from "@/components/shell/site-chrome";

const routes = [
  {
    href: "/brief",
    code: "BRF-01",
    label: "Project brief",
    detail: "Market context, product posture, and evaluation criteria from goal.md.",
  },
  {
    href: "/explorations",
    code: "EXP-02",
    label: "Design explorations",
    detail: "Terminal-density layouts, evidence rows, and motion vocabulary.",
  },
  {
    href: "/primitive",
    code: "PRM-03",
    label: "Transfer primitive",
    detail: "Composable send-transfer dialog with in-flow dependency resolution.",
  },
];

export default function Home() {
  return (
    <SiteChrome>
      <main className="py-12 pb-20">
        <section className="grid gap-12 border-b border-[#2a2e2c] pb-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="font-mono text-xs text-[#c49a6c]">AI billing transaction layer</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-tight sm:text-6xl">
              Settle AI work with provenance, not peer-to-peer vibes.
            </h1>
          </div>
          <p className="max-w-md text-base leading-7 text-[#a39e90]">
            Cursor-track prototype for Internet Backyard: a market-terminal transfer primitive
            covering counterparty, settlement rail, usage evidence, benchmark context, validation,
            and motion-driven recovery — mocked end to end.
          </p>
        </section>

        <section className="mt-10 grid gap-3 md:grid-cols-3">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="group rounded-md border border-[#2a2e2c] bg-[#0f1210] p-5 transition hover:border-[#c49a6c]/50 hover:bg-[#141816]"
            >
              <div className="mb-10 font-mono text-[10px] tracking-[0.16em] text-[#7d786c]">
                {route.code}
              </div>
              <h2 className="text-lg font-medium text-[#f2ebe0]">{route.label}</h2>
              <p className="mt-2 text-sm leading-6 text-[#8f8a7e]">{route.detail}</p>
              <div className="mt-6 font-mono text-xs text-[#c49a6c] opacity-0 transition group-hover:opacity-100">
                {route.href} →
              </div>
            </Link>
          ))}
        </section>

        <footer className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-[#2a2e2c] pt-6 font-mono text-xs text-[#7d786c]">
          <span>ref: goal.md · mocked settlement store</span>
          <span>Next.js 16 · App Router · Zod · Zustand · Motion</span>
        </footer>
      </main>
    </SiteChrome>
  );
}

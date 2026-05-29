import Link from "next/link";
import { SiteChrome } from "@/components/shell/site-chrome";

const tokens = [
  { name: "graphite-950", swatch: "#0a0c0b", use: "page base" },
  { name: "panel-900", swatch: "#0f1210", use: "cards / dialog" },
  { name: "copper-400", swatch: "#c49a6c", use: "accent / CTA" },
  { name: "parchment-100", swatch: "#f2ebe0", use: "primary text" },
  { name: "ash-500", swatch: "#8f8a7e", use: "metadata" },
];

const patterns = [
  "Thin 1px borders on panels — no heavy shadows",
  "Mono labels with uppercase tracking for field keys",
  "Evidence rows: hash · confidence · unit quantity",
  "Status chips for rail/counterparty validation state",
  "Spring transitions on step changes (compose ↔ detour ↔ review)",
];

export default function ExplorationsPage() {
  return (
    <SiteChrome>
      <main className="py-10 pb-16">
        <Link href="/" className="font-mono text-xs text-[#8f8a7e] hover:text-[#c49a6c]">
          ← index
        </Link>
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-[#c49a6c]">
          Design explorations
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Market-terminal visual language
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#a39e90]">
          Cursor track uses copper accents on graphite (distinct from green-accent Codex track)
          while staying dense, readable, and ops-desk native.
        </p>

        <section className="mt-10">
          <h2 className="font-mono text-xs uppercase tracking-wide text-[#9a9588]">Palette</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {tokens.map((token) => (
              <div
                key={token.name}
                className="rounded-md border border-[#2a2e2c] bg-[#0f1210] p-3"
              >
                <div
                  className="h-12 rounded border border-[#2a2e2c]"
                  style={{ backgroundColor: token.swatch }}
                />
                <p className="mt-2 font-mono text-xs text-[#f2ebe0]">{token.name}</p>
                <p className="text-[11px] text-[#7d786c]">{token.use}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-md border border-[#2a2e2c] bg-[#0f1210] p-5">
          <h2 className="font-mono text-xs uppercase tracking-wide text-[#9a9588]">
            Sample evidence row
          </h2>
          <div className="mt-4 grid gap-2 font-mono text-xs sm:grid-cols-[1fr_auto_auto]">
            <span className="text-[#f2ebe0]">usage_eval_swarm_042</span>
            <span className="text-[#c49a6c]">96% conf</span>
            <span className="text-[#8f8a7e]">sha256:8c42…</span>
          </div>
          <div className="mt-2 text-sm text-[#a39e90]">Eval swarm batch 042 · 184,320 B200 gpu-sec</div>
        </section>

        <section className="mt-6">
          <h2 className="font-mono text-xs uppercase tracking-wide text-[#9a9588]">Patterns</h2>
          <ul className="mt-4 space-y-2">
            {patterns.map((pattern) => (
              <li
                key={pattern}
                className="rounded-md border border-[#2a2e2c] bg-[#141816] px-4 py-3 text-sm text-[#c8c2b4]"
              >
                {pattern}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </SiteChrome>
  );
}

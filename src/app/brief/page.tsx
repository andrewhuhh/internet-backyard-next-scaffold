import Link from "next/link";
import { SiteChrome } from "@/components/shell/site-chrome";

const sections = [
  {
    title: "Product posture",
    body: "Internet Backyard is building the transactions layer for AI billing beyond token counting — usage, agent credits, compute consumption, and outcome-linked settlement with auditable provenance.",
  },
  {
    title: "Transfer primitive",
    body: "A composable send-transfer dialog resolves counterparty and settlement rail inside the flow when missing, then returns to compose → review → submit with deliberate motion between states.",
  },
  {
    title: "Evaluation",
    body: "Cursor track in a bakeoff against Codex: visual design, motion, state handling, validation, and deployable output. Tone: market terminal + finance ops desk, not consumer P2P.",
  },
];

export default function BriefPage() {
  return (
    <SiteChrome>
      <main className="py-10 pb-16">
        <Link href="/" className="font-mono text-xs text-[#8f8a7e] hover:text-[#c49a6c]">
          ← index
        </Link>
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-[#c49a6c]">
          Project brief
        </p>
        <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Framing the settlement desk prototype
        </h1>

        <div className="mt-10 grid gap-4">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-md border border-[#2a2e2c] bg-[#0f1210] p-5"
            >
              <h2 className="font-mono text-xs uppercase tracking-wide text-[#9a9588]">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#c8c2b4]">{section.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-md border border-[#2a2e2c] bg-[#141816] p-5 font-mono text-xs leading-6 text-[#8f8a7e]">
          <p className="text-[#c49a6c]">Dependency matrix (demo)</p>
          <ul className="mt-3 space-y-1">
            <li>ready — counterparty + rail available</li>
            <li>missing-counterparty — onboard inside dialog</li>
            <li>missing-rail — attach rail inside dialog</li>
            <li>empty — both resolved in-flow</li>
            <li>expedited + amount &gt; $1,500 — simulated failure</li>
          </ul>
        </div>
      </main>
    </SiteChrome>
  );
}

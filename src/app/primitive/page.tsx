import Link from "next/link";
import { SendTransferDialog, TransferDemoControls } from "@/components/settlement/transfer-dialog";
import { SettlementLedger } from "@/components/settlement/settlement-ledger";
import { SiteChrome } from "@/components/shell/site-chrome";

export default function PrimitivePage() {
  return (
    <SiteChrome>
      <main className="py-10 pb-16">
        <Link href="/" className="font-mono text-xs text-[#8f8a7e] hover:text-[#c49a6c]">
          ← index
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
          <section className="grid min-h-[420px] place-items-center rounded-md border border-[#2a2e2c] bg-[#0f1210] p-8">
            <div className="max-w-md text-center">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#c49a6c]">
                Composable primitive
              </p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Send an AI usage transfer
              </h1>
              <p className="mx-auto mt-4 text-sm leading-7 text-[#a39e90]">
                Resolve dependencies in-flow. Try pending-validation, blocked counterparty, or
                expedited failure above $1,500.
              </p>
              <div className="mt-8 flex justify-center">
                <SendTransferDialog />
              </div>
            </div>
          </section>

          <section>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-[#9a9588]">
              Settlement ledger
            </p>
            <SettlementLedger />
          </section>
        </div>

        <section className="mt-8">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-[#9a9588]">
            Demo controls
          </p>
          <TransferDemoControls />
        </section>
      </main>
    </SiteChrome>
  );
}

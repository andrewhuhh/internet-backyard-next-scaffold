import Link from "next/link";
import { SendTransferDialog, TransferDemoControls } from "@/components/settlement/transfer-dialog";
import { SiteChrome } from "@/components/shell/site-chrome";

export default function PrimitivePage() {
  return (
    <SiteChrome>
      <main className="py-10 pb-16">
        <Link href="/" className="font-mono text-xs text-[#8f8a7e] hover:text-[#c49a6c]">
          ← index
        </Link>

        <section className="mt-10 grid min-h-[480px] place-items-center rounded-md border border-[#2a2e2c] bg-[#0f1210] p-8">
          <div className="max-w-lg text-center">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#c49a6c]">
              Composable primitive
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Send an AI usage transfer
            </h1>
            <p className="mx-auto mt-4 text-sm leading-7 text-[#a39e90]">
              Counterparty and settlement rail resolve inside the dialog. Try demo scenarios
              below — including expedited review failure above $1,500.
            </p>
            <div className="mt-8 flex justify-center">
              <SendTransferDialog />
            </div>
          </div>
        </section>

        <section className="mt-6">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-[#9a9588]">
            Demo controls
          </p>
          <TransferDemoControls />
        </section>
      </main>
    </SiteChrome>
  );
}

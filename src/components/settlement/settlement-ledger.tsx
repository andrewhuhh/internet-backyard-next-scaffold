"use client";

import { motion } from "motion/react";
import { cents, useSettlementStore } from "@/lib/settlement/store";
import { seededCounterparties, seededRails } from "@/lib/settlement/seed";

const statusLabel: Record<string, string> = {
  settled: "settled",
  queued_review: "queued review",
  failed: "failed",
};

export function SettlementLedger() {
  const receipts = useSettlementStore((s) => s.receipts);
  const usageEvidence = useSettlementStore((s) => s.usageEvidence);
  const localCounterparties = useSettlementStore((s) => s.localCounterparties);
  const localRails = useSettlementStore((s) => s.localRails);

  if (receipts.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-[#2a2e2c] bg-[#0f1210] p-6 text-center">
        <p className="font-mono text-xs uppercase tracking-wide text-[#7d786c]">
          Settlement ledger empty
        </p>
        <p className="mt-2 text-sm text-[#8f8a7e]">
          Complete a transfer to record provenance here (persisted locally).
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-[#2a2e2c] bg-[#0f1210]">
      <div className="grid grid-cols-[1fr_auto] gap-2 border-b border-[#2a2e2c] px-4 py-2 font-mono text-[10px] uppercase tracking-wide text-[#7d786c]">
        <span>Transaction</span>
        <span>State</span>
      </div>
      <ul className="divide-y divide-[#2a2e2c]">
        {receipts.map((receipt, index) => {
          const counterparty =
            [...seededCounterparties, ...localCounterparties].find(
              (c) => c.id === receipt.counterpartyId,
            ) ?? null;
          const rail =
            [...seededRails, ...localRails].find((r) => r.id === receipt.railId) ?? null;
          const usage = usageEvidence.find((u) => u.id === receipt.usageEvidenceId);

          return (
            <motion.li
              key={receipt.id}
              initial={index === 0 ? { opacity: 0, y: -6 } : false}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-2 px-4 py-3 sm:grid-cols-[1fr_auto]"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-[#c49a6c]">{receipt.auditRef}</span>
                  <span className="font-mono text-[10px] text-[#7d786c]">{receipt.id}</span>
                </div>
                <p className="mt-1 text-sm text-[#f2ebe0]">
                  {cents(receipt.amountCents)} → {counterparty?.displayName ?? receipt.counterpartyId}
                </p>
                <p className="mt-1 font-mono text-[11px] leading-5 text-[#8f8a7e]">
                  {rail?.label ?? receipt.railId} · {usage?.workloadName ?? receipt.usageEvidenceId}
                </p>
                <p className="mt-1 truncate font-mono text-[10px] text-[#6d6860]">
                  {receipt.memo}
                </p>
              </div>
              <div className="text-right sm:pt-0.5">
                <span
                  className={
                    receipt.status === "settled"
                      ? "font-mono text-[10px] uppercase text-[#b8d4b0]"
                      : receipt.status === "queued_review"
                        ? "font-mono text-[10px] uppercase text-[#c49a6c]"
                        : "font-mono text-[10px] uppercase text-[#e07a6a]"
                  }
                >
                  {statusLabel[receipt.status] ?? receipt.status}
                </span>
                <p className="mt-1 font-mono text-[10px] text-[#7d786c]">
                  {new Date(receipt.createdAt).toLocaleString()}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

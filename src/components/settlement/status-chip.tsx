import type { CounterpartyStatus, RailStatus } from "@/lib/settlement/schema";
import { cn } from "@/lib/utils";

type ChipTone = "ok" | "warn" | "danger" | "neutral";

const counterpartyTone: Record<CounterpartyStatus, ChipTone> = {
  verified: "ok",
  pending_review: "warn",
  missing_evidence: "warn",
  blocked: "danger",
};

const railTone: Record<RailStatus, ChipTone> = {
  ready: "ok",
  requires_microdeposit: "warn",
  requires_approval: "warn",
  suspended: "danger",
};

const toneClass: Record<ChipTone, string> = {
  ok: "border-[#5a7a52]/50 bg-[#5a7a52]/15 text-[#b8d4b0]",
  warn: "border-[#c49a6c]/45 bg-[#c49a6c]/12 text-[#e8d5c0]",
  danger: "border-[#a85a4a]/50 bg-[#a85a4a]/15 text-[#f0b5ab]",
  neutral: "border-[#3a4038] bg-[#1a1e1b] text-[#9a9588]",
};

export function CounterpartyStatusChip({
  status,
  cleared,
}: {
  status: CounterpartyStatus;
  cleared?: boolean;
}) {
  const effective = cleared ? "verified" : status;
  const tone = counterpartyTone[effective];
  const label = cleared ? "cleared (demo)" : status.replaceAll("_", " ");

  return (
    <span
      className={cn(
        "inline-flex rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide",
        toneClass[tone],
      )}
    >
      {label}
    </span>
  );
}

export function RailStatusChip({ status, cleared }: { status: RailStatus; cleared?: boolean }) {
  const effective = cleared ? "ready" : status;
  const tone = railTone[effective];
  const label = cleared ? "cleared (demo)" : status.replaceAll("_", " ");

  return (
    <span
      className={cn(
        "inline-flex rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide",
        toneClass[tone],
      )}
    >
      {label}
    </span>
  );
}

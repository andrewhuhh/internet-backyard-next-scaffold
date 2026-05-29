"use client";

import type React from "react";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  ArrowLeft,
  Banknote,
  CheckCircle2,
  Loader2,
  Plus,
  UserRound,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { scenarioPresets } from "@/lib/settlement/seed";
import { CounterpartyStatusChip, RailStatusChip } from "@/components/settlement/status-chip";
import {
  cents,
  effectiveCounterpartyStatus,
  effectiveRailStatus,
  selectAvailableCounterparties,
  selectAvailableRails,
  selectResolvedDependencies,
  useSettlementStore,
} from "@/lib/settlement/store";
import type { CounterpartyType, RailType } from "@/lib/settlement/schema";

const panelTransition = { type: "spring", stiffness: 520, damping: 44, mass: 0.7 } as const;

export function SendTransferDialog() {
  const [open, setOpen] = useState(false);
  const state = useSettlementStore();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#c49a6c]/40 bg-[#c49a6c]/15 px-4 text-sm font-medium text-[#f2ebe0] transition hover:bg-[#c49a6c]/25">
        <Banknote className="size-4" />
        Send transfer
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] overflow-hidden border border-[#3a4038] bg-[#0f1210] p-0 text-[#f2ebe0] sm:max-w-xl">
        <div className="border-b border-[#3a4038] p-5">
          <DialogHeader className="pr-8">
            <DialogTitle className="text-[#f2ebe0]">{titleForStep(state.step)}</DialogTitle>
            <DialogDescription className="text-[#a39e90]">
              {descriptionForStep(state.step)}
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-5">
          <AnimatePresence mode="popLayout" custom={state.direction}>
            <motion.div
              key={state.step}
              custom={state.direction}
              initial={{ opacity: 0, x: 24 * state.direction, filter: "blur(2px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -18 * state.direction, filter: "blur(2px)" }}
              transition={panelTransition}
            >
              {state.step === "compose" && <ComposePanel />}
              {state.step === "counterparty" && <RecipientPanel />}
              {state.step === "rail" && <FundingSourcePanel />}
              {state.step === "review" && <ReviewPanel />}
              {state.step === "submitting" && <SubmittingPanel />}
              {state.step === "success" && <SuccessPanel close={() => setOpen(false)} />}
              {state.step === "failed" && <FailurePanel />}
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function TransferDemoControls() {
  const state = useSettlementStore();
  const counterparties = selectAvailableCounterparties(state);
  const rails = selectAvailableRails(state);
  const { counterparty, rail } = selectResolvedDependencies(state);

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_1.2fr]">
      <div className="rounded-md border border-[#3a4038] bg-[#141816] p-4">
        <Label className="text-xs text-[#9a9588]">Demo scenario</Label>
        <Select
          value={state.scenarioId}
          onValueChange={(value) => {
            if (value) state.setScenario(value as typeof state.scenarioId);
          }}
        >
          <SelectTrigger className="mt-2 w-full border-[#3a4038] bg-[#0f1210]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {scenarioPresets.map((scenario) => (
              <SelectItem key={scenario.id} value={scenario.id}>
                {scenario.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-3 rounded-md border border-[#3a4038] bg-[#141816] p-4 sm:grid-cols-2">
        <DemoStatus
          label="Counterparty"
          value={counterparty?.displayName ?? `${counterparties.length} available`}
          ready={Boolean(counterparty)}
        />
        <DemoStatus
          label="Settlement rail"
          value={rail?.label ?? `${rails.length} available`}
          ready={Boolean(rail)}
        />
      </div>
    </div>
  );
}

function ComposePanel() {
  const state = useSettlementStore();
  const recipients = selectAvailableCounterparties(state);
  const fundingSources = selectAvailableRails(state);
  const { counterparty, rail } = selectResolvedDependencies(state);
  const selectedUsage = state.usageEvidence.find((item) => item.id === state.draft.usageEvidenceId);
  const compatibleQuotes = useMemo(
    () => state.benchmarkQuotes.filter((quote) => quote.basis === selectedUsage?.meteringBasis),
    [selectedUsage?.meteringBasis, state.benchmarkQuotes],
  );
  const validation = state.validateDraft();
  const missingRecipient = recipients.length === 0 || !counterparty;
  const missingFunding = fundingSources.length === 0 || !rail;
  const cleared = state.clearedDependencyIds;
  const cpEffective = counterparty ? effectiveCounterpartyStatus(counterparty, cleared) : null;
  const railEffective = rail ? effectiveRailStatus(rail, cleared) : null;
  const needsCpClearance =
    counterparty && cpEffective !== "verified" && !cleared.includes(counterparty.id);
  const needsRailClearance = rail && railEffective !== "ready" && !cleared.includes(rail.id);

  return (
    <div className="space-y-5">
      {(needsCpClearance || needsRailClearance) && (
        <Alert className="border-[#c49a6c]/35 bg-[#c49a6c]/10 text-[#f2ebe0]">
          <AlertCircle className="size-4 text-[#c49a6c]" />
          <AlertDescription className="space-y-2">
            <p>Dependency validation in progress.</p>
            <div className="flex flex-wrap gap-2">
              {needsCpClearance && counterparty && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 border-[#3a4038] text-xs"
                  onClick={() => state.clearDependency(counterparty.id)}
                >
                  Simulate counterparty clearance
                </Button>
              )}
              {needsRailClearance && rail && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 border-[#3a4038] text-xs"
                  onClick={() => state.clearDependency(rail.id)}
                >
                  Simulate rail clearance
                </Button>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {(missingRecipient || missingFunding) && (
        <Alert className="border-[#c49a6c]/35 bg-[#c49a6c]/10 text-[#f2ebe0]">
          <AlertCircle className="size-4 text-[#c49a6c]" />
          <AlertDescription>
            {missingRecipient && missingFunding
              ? "Resolve counterparty and settlement rail to continue."
              : missingRecipient
                ? "Add or select a counterparty to continue."
                : "Add or select a settlement rail to continue."}
          </AlertDescription>
        </Alert>
      )}

      <Field label="Counterparty">
        {recipients.length ? (
          <div className="grid gap-2">
            <Select
              value={state.draft.counterpartyId}
              onValueChange={(counterpartyId) =>
                state.updateDraft({ counterpartyId: counterpartyId ?? "" })
              }
            >
              <SelectTrigger className="w-full border-[#3a4038] bg-[#0f1210]">
                <SelectValue placeholder="Select counterparty" />
              </SelectTrigger>
              <SelectContent>
                {recipients.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {counterparty && (
              <div className="flex flex-wrap items-center gap-2">
                <CounterpartyStatusChip
                  status={counterparty.status}
                  cleared={cleared.includes(counterparty.id)}
                />
                <QuietMeta>{counterparty.externalRef}</QuietMeta>
              </div>
            )}
          </div>
        ) : (
          <AddInline
            icon={<UserRound className="size-4" />}
            label="Register counterparty"
            onClick={() => state.setStep("counterparty")}
          />
        )}
        {recipients.length > 0 && (
          <Button
            variant="ghost"
            className="mt-2 px-0 text-[#9a9588] hover:text-[#f2ebe0]"
            onClick={() => state.setStep("counterparty")}
          >
            <Plus className="size-4" />
            New counterparty
          </Button>
        )}
      </Field>

      <Field label="Settlement rail">
        {fundingSources.length ? (
          <div className="grid gap-2">
            <Select
              value={state.draft.railId}
              onValueChange={(railId) => state.updateDraft({ railId: railId ?? "" })}
            >
              <SelectTrigger className="w-full border-[#3a4038] bg-[#0f1210]">
                <SelectValue placeholder="Select rail" />
              </SelectTrigger>
              <SelectContent>
                {fundingSources.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {rail && (
              <div className="flex flex-wrap items-center gap-2">
                <RailStatusChip status={rail.status} cleared={cleared.includes(rail.id)} />
                <QuietMeta>
                  {cents(rail.availableCents)} available · {rail.settlementWindow}
                </QuietMeta>
              </div>
            )}
          </div>
        ) : (
          <AddInline
            icon={<Banknote className="size-4" />}
            label="Attach settlement rail"
            onClick={() => state.setStep("rail")}
          />
        )}
        {fundingSources.length > 0 && (
          <Button
            variant="ghost"
            className="mt-2 px-0 text-[#9a9588] hover:text-[#f2ebe0]"
            onClick={() => state.setStep("rail")}
          >
            <Plus className="size-4" />
            New rail
          </Button>
        )}
      </Field>

      <Field label="Usage evidence">
        <Select
          value={state.draft.usageEvidenceId}
          onValueChange={(usageEvidenceId) =>
            state.updateDraft({ usageEvidenceId: usageEvidenceId ?? "" })
          }
        >
          <SelectTrigger className="w-full border-[#3a4038] bg-[#0f1210]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {state.usageEvidence.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.workloadName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedUsage && (
          <QuietMeta>
            {selectedUsage.confidence}% confidence · {selectedUsage.evidenceHash}
          </QuietMeta>
        )}
      </Field>

      <Field label="Benchmark context">
        <Select
          value={state.draft.benchmarkQuoteId}
          onValueChange={(benchmarkQuoteId) =>
            state.updateDraft({ benchmarkQuoteId: benchmarkQuoteId ?? "" })
          }
        >
          <SelectTrigger className="w-full border-[#3a4038] bg-[#0f1210]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {compatibleQuotes.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-[1fr_90px]">
        <Field label="Amount (USD)">
          <Input
            className="border-[#3a4038] bg-[#0f1210]"
            inputMode="decimal"
            value={(state.draft.amountCents / 100).toString()}
            onChange={(event) =>
              state.updateDraft({
                amountCents: Math.round(Number(event.target.value || 0) * 100),
              })
            }
          />
        </Field>
        <Field label="Review mode">
          <Select
            value={state.draft.reviewMode}
            onValueChange={(reviewMode) => {
              if (reviewMode) {
                state.updateDraft({
                  reviewMode: reviewMode as typeof state.draft.reviewMode,
                });
              }
            }}
          >
            <SelectTrigger className="w-full border-[#3a4038] bg-[#0f1210]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="expedited">Expedited</SelectItem>
              <SelectItem value="manual_review">Manual review</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field label="Audit memo">
        <Textarea
          className="min-h-18 resize-none border-[#3a4038] bg-[#0f1210]"
          value={state.draft.memo}
          onChange={(event) => state.updateDraft({ memo: event.target.value })}
        />
      </Field>

      {!validation.ok && state.step === "compose" && (
        <p className="text-sm text-[#e07a6a]">{validation.message}</p>
      )}

      <div className="flex justify-end gap-2 pt-1">
        <Button
          variant="outline"
          className="border-[#3a4038] bg-transparent text-[#c8c2b4]"
          onClick={() => state.updateDraft({ reviewMode: "standard" })}
        >
          Reset mode
        </Button>
        <Button
          className="border border-[#c49a6c]/40 bg-[#c49a6c]/20 text-[#f2ebe0] hover:bg-[#c49a6c]/30"
          disabled={missingRecipient || missingFunding || !validation.ok}
          onClick={() => {
            const result = state.validateDraft();
            if (result.ok) state.setStep("review");
          }}
        >
          Review settlement
        </Button>
      </div>
    </div>
  );
}

function RecipientPanel() {
  const state = useSettlementStore();
  const [displayName, setDisplayName] = useState("");
  const [type, setType] = useState<CounterpartyType>("model_provider");
  const [network, setNetwork] = useState("IBY onboarding desk");
  const [externalRef, setExternalRef] = useState("draft:counterparty");

  return (
    <DetourShell>
      <Field label="Display name">
        <Input
          className="border-[#3a4038] bg-[#0f1210]"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder="Counterparty name"
        />
      </Field>
      <Field label="Type">
        <Select value={type} onValueChange={(value) => setType(value as CounterpartyType)}>
          <SelectTrigger className="w-full border-[#3a4038] bg-[#0f1210]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="model_provider">Model provider</SelectItem>
            <SelectItem value="agent_vendor">Agent vendor</SelectItem>
            <SelectItem value="workspace">Workspace</SelectItem>
            <SelectItem value="compute_market">Compute market</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Network">
        <Input
          className="border-[#3a4038] bg-[#0f1210]"
          value={network}
          onChange={(event) => setNetwork(event.target.value)}
        />
      </Field>
      <Field label="External reference">
        <Input
          className="border-[#3a4038] bg-[#0f1210]"
          value={externalRef}
          onChange={(event) => setExternalRef(event.target.value)}
        />
      </Field>
      <Button
        className="w-full border border-[#c49a6c]/40 bg-[#c49a6c]/20"
        disabled={displayName.length < 2}
        onClick={() => state.addCounterparty({ displayName, type, network, externalRef })}
      >
        Save counterparty
      </Button>
    </DetourShell>
  );
}

function FundingSourcePanel() {
  const state = useSettlementStore();
  const [label, setLabel] = useState("");
  const [type, setType] = useState<RailType>("operating_balance");
  const [currency, setCurrency] = useState("USD");
  const [available, setAvailable] = useState("50000");

  return (
    <DetourShell>
      <Field label="Rail label">
        <Input
          className="border-[#3a4038] bg-[#0f1210]"
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          placeholder="Settlement rail name"
        />
      </Field>
      <Field label="Rail type">
        <Select value={type} onValueChange={(value) => setType(value as RailType)}>
          <SelectTrigger className="w-full border-[#3a4038] bg-[#0f1210]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="operating_balance">Operating balance</SelectItem>
            <SelectItem value="bank_account">Bank account</SelectItem>
            <SelectItem value="wire">Wire</SelectItem>
            <SelectItem value="usage_credit">Usage credit</SelectItem>
            <SelectItem value="invoice_agreement">Invoice agreement</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Currency">
          <Input
            className="border-[#3a4038] bg-[#0f1210]"
            value={currency}
            onChange={(event) => setCurrency(event.target.value)}
          />
        </Field>
        <Field label="Available (USD)">
          <Input
            className="border-[#3a4038] bg-[#0f1210]"
            value={available}
            onChange={(event) => setAvailable(event.target.value)}
          />
        </Field>
      </div>
      <Button
        className="w-full border border-[#c49a6c]/40 bg-[#c49a6c]/20"
        disabled={label.length < 2}
        onClick={() =>
          state.addRail({
            label,
            type,
            currency,
            availableCents: Math.round(Number(available || 0) * 100),
          })
        }
      >
        Save settlement rail
      </Button>
    </DetourShell>
  );
}

function ReviewPanel() {
  const state = useSettlementStore();
  const { counterparty, rail } = selectResolvedDependencies(state);
  const usage = state.usageEvidence.find((item) => item.id === state.draft.usageEvidenceId);
  const benchmark = state.benchmarkQuotes.find((item) => item.id === state.draft.benchmarkQuoteId);

  return (
    <div className="space-y-4">
      <ReviewRow label="Counterparty" value={counterparty?.displayName ?? "—"} />
      <ReviewRow label="Settlement rail" value={rail?.label ?? "—"} />
      <ReviewRow label="Usage evidence" value={usage?.workloadName ?? "—"} />
      <ReviewRow label="Benchmark" value={benchmark?.label ?? "—"} />
      <ReviewRow label="Amount" value={cents(state.draft.amountCents)} badge={state.draft.currency} />
      <ReviewRow label="Review mode" value={state.draft.reviewMode.replaceAll("_", " ")} />
      <ReviewRow label="Audit memo" value={state.draft.memo} />
      <div className="flex justify-end gap-2 pt-2">
        <Button
          variant="outline"
          className="border-[#3a4038]"
          onClick={() => state.setStep("compose", -1)}
        >
          Back
        </Button>
        <Button
          className="border border-[#c49a6c]/40 bg-[#c49a6c]/20"
          onClick={() => void state.submit()}
        >
          Submit settlement
        </Button>
      </div>
    </div>
  );
}

function SubmittingPanel() {
  return (
    <StatePanel
      icon={<Loader2 className="size-9 animate-spin text-[#c49a6c]" />}
      title="Recording settlement"
    />
  );
}

function SuccessPanel({ close }: { close: () => void }) {
  const receipt = useSettlementStore((state) => state.receipts[0]);
  return (
    <StatePanel
      icon={<CheckCircle2 className="size-10 text-[#c49a6c]" />}
      title="Settlement recorded"
      body={receipt ? `${receipt.auditRef} · ${receipt.status.replaceAll("_", " ")}` : undefined}
      action={
        <Button className="border border-[#c49a6c]/40 bg-[#c49a6c]/20" onClick={close}>
          Close
        </Button>
      }
    />
  );
}

function FailurePanel() {
  const state = useSettlementStore();
  return (
    <StatePanel
      icon={<AlertCircle className="size-10 text-[#e07a6a]" />}
      title="Settlement blocked"
      body={state.lastError ?? "The settlement could not be submitted."}
      action={
        <Button variant="outline" className="border-[#3a4038]" onClick={state.resetFailure}>
          Return to compose
        </Button>
      }
    />
  );
}

function DetourShell({ children }: { children: React.ReactNode }) {
  const state = useSettlementStore();
  return (
    <div className="space-y-5">
      <Button
        variant="ghost"
        className="px-0 text-[#9a9588] hover:text-[#f2ebe0]"
        onClick={() => state.setStep("compose", -1)}
      >
        <ArrowLeft className="size-4" />
        Back to transfer
      </Button>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-2 block text-xs font-medium tracking-wide text-[#9a9588] uppercase">
        {label}
      </Label>
      {children}
    </div>
  );
}

function QuietMeta({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-xs text-[#7d786c]">{children}</p>;
}

function AddInline({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className="flex h-12 w-full items-center justify-center gap-2 rounded-md border border-dashed border-[#c49a6c]/45 bg-[#c49a6c]/8 text-sm text-[#e8d5c0] transition hover:bg-[#c49a6c]/14"
      onClick={onClick}
      type="button"
    >
      {icon}
      {label}
    </button>
  );
}

function ReviewRow({ label, value, badge }: { label: string; value: string; badge?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#3a4038] pb-3 last:border-b-0">
      <div>
        <div className="font-mono text-xs text-[#9a9588] uppercase tracking-wide">{label}</div>
        <div className="mt-1 text-sm leading-6 text-[#f2ebe0]">{value}</div>
      </div>
      {badge && (
        <Badge variant="secondary" className="border-[#3a4038] bg-[#1a1e1b] text-[#c8c2b4]">
          {badge}
        </Badge>
      )}
    </div>
  );
}

function StatePanel({
  icon,
  title,
  body,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  body?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center text-center">
      {icon}
      <h3 className="mt-5 text-xl font-semibold text-[#f2ebe0]">{title}</h3>
      {body && <p className="mt-2 max-w-sm text-sm leading-6 text-[#a39e90]">{body}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

function DemoStatus({ label, value, ready }: { label: string; value: string; ready: boolean }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-[#9a9588]">
        {ready ? (
          <CheckCircle2 className="size-4 text-[#c49a6c]" />
        ) : (
          <AlertCircle className="size-4 text-[#c49a6c]/80" />
        )}
        {label}
      </div>
      <p className="mt-1 truncate font-mono text-sm text-[#f2ebe0]">{value}</p>
    </div>
  );
}

function titleForStep(step: ReturnType<typeof useSettlementStore.getState>["step"]) {
  switch (step) {
    case "counterparty":
      return "Register counterparty";
    case "rail":
      return "Attach settlement rail";
    case "review":
      return "Review settlement";
    case "submitting":
      return "Submitting";
    case "success":
      return "Complete";
    case "failed":
      return "Blocked";
    default:
      return "Send transfer";
  }
}

function descriptionForStep(step: ReturnType<typeof useSettlementStore.getState>["step"]) {
  switch (step) {
    case "counterparty":
      return "Onboard the counterparty without leaving the transfer flow.";
    case "rail":
      return "Attach a funding path and return to settlement.";
    case "review":
      return "Confirm usage evidence, benchmark, and rail limits.";
    case "submitting":
      return "Validating provenance and recording the transaction.";
    case "success":
    case "failed":
      return "";
    default:
      return "Counterparty, settlement rail, usage evidence, and amount.";
  }
}

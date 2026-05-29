# Prototype decisions (Cursor track)

## Visual system

- **Graphite + copper** palette to differentiate from the green-accent Codex track while keeping market-terminal density.
- Mono labels, thin borders, evidence hashes inline — no gradients or P2P payment copy.

## State model

- **Zustand** holds flow step, draft intent, scenario availability, and persisted local counterparties/rails/receipts.
- **Zod** validates settlement intent at runtime; business rules (blocked, pending, rail limits) live in `validateDraft`.
- **`clearedDependencyIds`** simulates ops-desk clearance without a backend.

## Motion

- Spring transitions on dialog step changes only (`compose` ↔ detour ↔ `review` ↔ terminal states) — not decorative page animation.

## Scenarios

| Scenario | Exercises |
|----------|-----------|
| ready | Happy path |
| missing-* / empty | In-flow dependency creation |
| pending-validation | In-progress + simulate clearance |
| blocked-counterparty | Hard validation failure |
| expedited + high amount | Submission failure |

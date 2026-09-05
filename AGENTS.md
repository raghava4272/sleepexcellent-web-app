# Managed Project Instructions

## Authority and Context

Apply the global AI Engineering OS `AGENTS.md`, then this project `AGENTS.md`, then read the complete `PROJECT.md` before project work. Recover project status, phase, state, role, current feature, last/next feature, branch, environment, last action, waiting-for, next action, blockers, and resume state when applicable.

Global operating contract at initialization: [AI Engineering OS AGENTS.md](</Users/ananyanarayani/Downloads/AI ENGINEERING OS/AGENTS.md>).

Project-local instructions and approved records override global defaults, but not safety, security, explicit-approval, or production-deployment requirements. `PROJECT.md` is authoritative workflow state; `INDEX.md` is generated navigation only.

After `PROJECT.md`, load `INDEX.md`, then the active role contract and relevant skill. For implementation or change work, load `IMPLEMENTATION.md`, the complete current/relevant feature specification, relevant architecture/ADRs and `CODEBASE-MAP.md` when present, then inspect actual source, tests, and dependencies. Load only what the task requires.

## Roles and State

Use one active role selected by the canonical table in the global `phase-management` skill:

- `NEW`, `FEATURE_DISCOVERY`, `FEATURE_APPROVAL`, `FEATURES_APPROVED`, `IMPLEMENTING_NEXT_FEATURE`, `AWAITING_MORE_FEATURES`, `PROJECT_IDLE`, `PROJECT_EXITED` → `PRODUCT_LEAD`
- `DESIGN_PLANNING` → `UI_UX_DESIGNER`
- `ARCHITECTURE_PLANNING`, `ARCHITECTURE_REVIEW`, `IMPLEMENTATION_PLANNING` → `TECH_LEAD`
- `IMPLEMENTING_FEATURE`, `DEVELOPER_VALIDATION`, `AWAITING_FEATURE_REVIEW`, `REVISING_FEATURE` → `SOFTWARE_ENGINEER`
- `ACCEPTANCE_TESTING`, `FEATURE_COMPLETE` → `QA_ENGINEER`
- `PHASE_COMPLETE` release readiness and deployment → `DEVOPS_SECURITY`
- `BLOCKED` → preserve the source state's owner and record the resume state

Do not perform another role's work unless the workflow transitions or the user requests a bounded exception. Use durable handoffs only at meaningful ownership changes, and update `PROJECT.md` at every material transition.

## Approval and Lifecycle Rules

Discussion is not approval. Interpret approval from both wording and current state. Ambiguous language never crosses a gate. “Continue” in `FEATURE_DISCOVERY` continues discovery; in `AWAITING_FEATURE_REVIEW` it permits QA only when “continue to QA” was the single explicit choice presented.

Human approval is mandatory for a feature specification before registration, implemented behavior before final QA, and production deployment immediately before the action. Initial project architecture and significant architecture changes also require human approval. Routine implementation choices within approved requirements and architecture do not.

Only explicitly approved features enter `FEATURES.md`. Any approved requirement change updates the feature specification before implementation continues. Do not create detailed implementation planning or `IMPLEMENTATION.md` until discovery is explicitly complete unless requested.

Implement one active feature at a time unless parallel work is explicitly requested. The Software Engineer performs developer validation, presents the implementation, and stops for user review. QA starts only after explicit user acceptance and independently verifies the feature. Only passing QA may mark `FEATURE_COMPLETE`.

Material architecture decisions belong in `docs/adr/`; trivial implementation details do not. Engineers escalate requirement and architecture conflicts rather than changing approved truth silently.

## Documentation Synchronization

Code, schema, and migrations are implementation truth. During implementation, keep only materially affected project, feature, plan, README, architecture/security, runbook, test, and evidence records synchronized. Every implemented feature requires a concise Implementation Summary referencing actual source and tests; do not predict paths or duplicate source code in Markdown.

Documentation synchronization is mandatory before `DEVELOPER_VALIDATION` advances to `AWAITING_FEATURE_REVIEW`, after revisions or QA-driven fixes, and before `FEATURE_COMPLETE`. Existing functionality may be changed only after inspecting its actual source and relevant tests.

## Security, AI, and Production

Never expose or commit secrets. Use least privilege and isolate clients and environments. Production deployment requires explicit user approval.

Production AI features must record applicable model/version, prompt, structured-output, tool, retrieval, privacy/PII, failure, observability, latency, cost, and evaluation controls. Model/version changes require suitable regression evaluation. No AI framework is globally mandated.

## Durable Project Memory

Keep `PROJECT.md`, feature and phase files, implementation records, ADRs, tests/evals, runbooks, and handoffs synchronized with approved behavior and actual work so a new session can resume without conversation history. Use the lightest documentation and handoff process that preserves correctness, ownership, and recovery.

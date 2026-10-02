# Quality Gates — Iris Computer Store

> Mandatory verification gates that must pass before any task is considered complete.

---

## 1. Gate Overview

```
REQUIREMENT → IMPLEMENTATION → BUILD → TEST → JUDGE → ACCEPTANCE
```

Every meaningful development task must pass through these gates sequentially.

---

## 2. Gate Definitions

### 2.1 Requirement Gate

**Before implementation begins:**

- [ ] Acceptance criteria are clear
- [ ] UX behavior is defined
- [ ] Design references are identified
- [ ] Data requirements are complete
- [ ] External integrations are specified
- [ ] Scope is defined (IN/OUT)
- [ ] User has approved ambiguous decisions

**Block condition:** Any requirement is ambiguous → STOP and ask.

### 2.2 Skill/MCP Gate

**Before implementation begins:**

- [ ] Required skills are identified
- [ ] Required skills are available
- [ ] Required MCPs are identified
- [ ] Required MCPs are available
- [ ] Skills are loaded before work

**Block condition:** Any required capability is unavailable → STOP and report.

### 2.3 Implementation Gate

**During implementation:**

- [ ] Code follows Angular conventions (standalone, signals, inject)
- [ ] Code follows TypeScript strict mode
- [ ] Code follows design system (tokens, not hardcoded colors)
- [ ] Code follows UX conventions (mobile-first, hover states, feedback)
- [ ] No silent architectural changes
- [ ] Change is scoped to requirements
- [ ] No drive-by refactoring

**Block condition:** Architectural change required → STOP and report first.

### 2.4 Build Gate

**After implementation:**

```bash
npm run build
```

- [ ] Build completes without errors
- [ ] Build completes without warnings (treat warnings as potential issues)
- [ ] Bundle size within budgets (initial: 1MB warning, 2MB error)
- [ ] No new dependencies introduced without justification

**Block condition:** Build fails → FIX before proceeding.

### 2.5 Test Gate

**After build passes:**

```bash
npm test
```

- [ ] All existing tests pass
- [ ] New tests added for new logic (where applicable)
- [ ] No regressions introduced

**Block condition:** Tests fail → FIX before proceeding.

### 2.6 Judge Gate

**After tests pass:**

All judges must PASS. Judges are READ-ONLY — they inspect and report.

#### Architecture Judge

- [ ] FDD compliance (features in `features/`, not mixed)
- [ ] Dependency direction (feature → shared/core, not feature → feature)
- [ ] Separation of concerns (UI ≠ business logic ≠ data access)
- [ ] No dangerous architectural debt

#### Angular/TypeScript Judge

- [ ] Angular 20 APIs used (not legacy ngIf/ngFor)
- [ ] TypeScript strict mode compliance
- [ ] Signals used for reactive state
- [ ] `inject()` used for DI (not constructor injection)
- [ ] No `any` types

#### UI/UX Judge

- [ ] Design system compliance (tokens, not hardcoded)
- [ ] Responsive behavior (mobile-first)
- [ ] Accessibility (aria-labels, focus states)
- [ ] Loading/empty/error states handled
- [ ] Hover states on interactive elements

#### Code Quality Judge

- [ ] Single responsibility principle
- [ ] Meaningful naming
- [ ] No code duplication
- [ ] Testability

#### Final Judge

- [ ] All acceptance criteria met
- [ ] No unresolved CRITICAL findings
- [ ] No unresolved HIGH findings

**Block condition:** Any CRITICAL or HIGH finding → FIX before proceeding.

---

## 3. Severity Levels

| Level | Definition | Action |
|-------|-----------|--------|
| CRITICAL | Blocks acceptance. Must fix. | FIX before proceeding |
| HIGH | Must fix before acceptance. | FIX before proceeding |
| MEDIUM | Should fix unless explicitly accepted. | User must accept |
| LOW | Improvement. Nice to have. | Optional |
| SUGGESTION | Optional improvement. | Optional |

---

## 4. Fix Loop

```
IMPLEMENTATION → JUDGE → FAIL → FIX AGENT → JUDGE AGAIN
```

**Rules:**
- Fix agent may ONLY address identified findings
- No unrelated refactoring allowed
- After fix, re-run the SAME judge
- If fix fails again → STOP and report to user

---

## 5. Final Acceptance

A task is complete only when:

```
ALL mandatory requirements met
    AND
No unresolved CRITICAL findings
    AND
No unresolved HIGH findings
    AND
Required judges PASS
    AND
Build verified (VERIFIED)
    AND
Tests verified where applicable (VERIFIED)
```

If a MEDIUM finding remains:
- User must explicitly accept it
- Document the acceptance

---

## 6. Verification Commands

| Gate | Command | Expected Result |
|------|---------|-----------------|
| Build | `npm run build` | Exit code 0, no errors |
| Test | `npm test` | All tests pass |
| Lint | `ng lint` (if configured) | No errors |

---

## 7. Documentation Gates

Documentation tasks follow the same gates:

- [ ] Content is accurate (verified against codebase)
- [ ] No hallucinated paths, commands, or APIs
- [ ] Examples are runnable
- [ ] Links resolve
- [ ] Language matches target audience

---

## 8. Gate Tracking

For non-trivial tasks, maintain explicit state:

```
[ ] Requirement Gate
[ ] Skill/MCP Gate
[ ] Implementation Gate
[ ] Build Gate
[ ] Test Gate
[ ] Judge Gate
[ ] Final Acceptance
```

Do not mark a step complete without evidence.

---

## 9. Special Cases

### Prototype Debt

Some debt is acceptable for the prototype:
- JSON Server (mock backend)
- Simplified auth (LocalStorage)
- Placeholder integrations

**But:** UI must not be tightly coupled to fake API. Abstraction must remain replaceable.

### No Tests Required

For trivial changes (documentation, typos, comments):
- Build gate still applies
- Test gate may be skipped
- Judge gate may be reduced to architecture only

---

*These gates ensure quality, consistency, and production readiness.*

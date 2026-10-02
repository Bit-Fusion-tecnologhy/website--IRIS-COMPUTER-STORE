# AGENTS.md — Operational Contract for AI Agents

> **Iris Computer Store** — Angular 20 Prototype  
> This document defines how AI agents MUST work in this repository.

---

## 1. Project Context

**Company:** Iris Computer (Santa Cruz, Bolivia)  
**Business:** Computers, laptops, gaming accessories, tech products, personalized advice, technical support  
**Status:** CLIENT DEMO / PROTOTYPE — must demonstrate product vision, validate UX, preserve production evolution path  
**Stack:** Angular 20.3, Tailwind CSS v4.2, TypeScript 5.9, JSON Server (mock backend)

---

## 2. Mandatory Operating Rules

### RULE 1: NEVER ASSUME

If something is ambiguous — requirements, business rules, UX behavior, architecture, APIs, data structures, permissions, validation, framework behavior, library APIs, missing files, user intent:

> **STOP AND ASK.**

### RULE 2: NEVER FAKE VERIFICATION

Use explicit status labels:
- `VERIFIED` — test/build/MCP actually executed and passed
- `NOT VERIFIED` — not yet executed
- `BLOCKED` — cannot execute
- `UNKNOWN` — status unclear

Never claim a test passed if not executed. Never claim an MCP was used if not verified.

### RULE 3: NO SILENT ARCHITECTURAL CHANGES

Do not restructure features, move files, introduce/remove libraries, replace patterns, change state management, redesign UI, or modify unrelated code without reporting first.

### RULE 4: USER IS FINAL AUTHORITY

When requirements are ambiguous or architectural alternatives exist, the user decides. The orchestrator may recommend but may NOT silently decide.

---

## 3. Stack Verification

Always verify from `package.json`:

| Dependency | Version | Notes |
|------------|---------|-------|
| Angular | ^20.3.0 | LTS — do NOT migrate during normal work |
| TypeScript | ~5.9.2 | Strict mode enabled |
| Tailwind CSS | ^4.2.1 | v4 with `@theme` directive, no `tailwind.config.js` |
| RxJS | ~7.8.0 | |
| JSON Server | ^1.0.0-beta.15 | Mock backend — `npm run server` |
| Express | ^5.1.0 | SSR server |
| Karma/Jasmine | ~6.4 / ~5.9 | Unit testing |

**Never assume the stack.** Always audit `package.json`.

---

## 4. Architecture

### Feature-Driven Development (FDD)

```
src/app/
├── core/                    # Singleton services, models, guards
│   ├── models/              # TypeScript interfaces
│   ├── services/            # Injectable services (providedIn: 'root')
│   └── guards/              # Route guards (CanActivateFn)
├── shared/                  # Shell components (header, footer, toast, cart-drawer)
└── features/                # Feature modules (lazy-loaded)
    ├── home/
    ├── catalog/
    ├── product/
    ├── cart/
    ├── wishlist/
    ├── about/
    ├── entrepreneurs/
    ├── auth/
    ├── account/
    └── pages/                # Checkout, contact
```

### Dependency Direction

```
feature → shared/core
```

**AVOID:** `feature A → feature B` unless explicitly justified.

---

## 5. Code Conventions

### Angular

1. **Standalone components** — No NgModules
2. **Signals** for reactive state (`signal`, `computed`)
3. **`inject()`** for dependency injection
4. **Lazy loading** on all routes (`loadComponent`)
5. **`@if` / `@for` / `@defer`** — NOT `ngIf` / `ngFor`
6. **Services** `providedIn: 'root'` with LocalStorage sync

### TypeScript

1. **Strict mode** — all checks enabled
2. **Interfaces** in `core/models/`
3. **No `any`** — use proper types
4. **Readonly** properties where appropriate

### Styling

1. **Tokens from `@theme`** in `src/styles.css` — no hardcoded colors
2. **Tailwind v4** — use `@theme` directive, NOT `tailwind.config.js`
3. **Utility classes** in `styles.css` — do not duplicate in components
4. **Material Symbols** via `<span class="material-symbols-outlined">`
5. **Fonts:** Sora (headlines), Hanken Grotesk (body), JetBrains Mono (labels)

### UX

1. **Mobile-first** — always start with mobile layout
2. **Hover states** on all interactive elements
3. **Visual feedback** on actions (toast notifications)
4. **Scroll lock** on drawers/modals (`body.style.overflow`)
5. **Lazy loading** on images (`loading="lazy" decoding="async"`)
6. **Skeleton loading** on async data

---

## 6. Data Layer

### JSON Server (Mock Backend)

- `db.json` is the data source
- API URL: `http://localhost:3000`
- Endpoints: `/products`, `/categories`, `/homeCategories`, `/cart`, `/orders`, `/users`, `/messages`

### Abstraction Pattern (Target)

```
UI → Feature → Data Access → API Adapter → JSON Server
```

**AVOID:** `Component → Direct JSON Server assumptions`

Prototype-only behavior must remain identifiable and replaceable.

---

## 7. Design System

**Authoritative files:**
- `DESIGN.md` — Complete design system (tokens, components, patterns)
- `DESIGN-CUSTOMER-REVIEWS.md` — Customer Reviews feature design

**Before implementing UI:**
1. Read both design files
2. Inspect existing components
3. Inspect design tokens (`src/styles.css`)
4. Identify gaps
5. Respect established patterns

**Design improvements are allowed** but must be reported first:

```
DESIGN IMPROVEMENT PROPOSAL
Current: ...
Problem: ...
Proposal: ...
Benefit: ...
Risk: ...
Decision required: YES
```

---

## 8. Skills & MCP Usage

### Required Skills (by context)

| Context | Skill |
|---------|-------|
| Angular code | `angular-developer` |
| UI/UX work | `frontend-design`, `frontend-ui-engineering`, `impeccable` |
| TypeScript types | `typescript-expert`, `typescript-advanced-types` |
| Code review | `code-review-and-quality` |
| Security | `security-and-hardening` |
| Performance | `performance-optimization` |

### Required MCPs (by capability)

| Capability | MCP |
|------------|-----|
| Angular documentation | Context7, Angular CLI MCP |
| Persistent memory | Engram |
| Design inspection | OpenPencil |
| Code intelligence | CodeGraph |

If a required capability is unavailable:

> **STOP.** Do not approximate.

---

## 9. Question Protocol

Ask questions when:
- Acceptance criteria are unclear
- UX behavior is ambiguous
- Design conflicts exist
- Architecture choices conflict
- Data requirements are incomplete
- External integration is unspecified
- Destructive change is required
- Multiple reasonable interpretations exist

**Do NOT ask** when the repository already provides the answer.

Questions must be: concise, specific, actionable.

---

## 10. Judge Architecture

Judges are **mandatory** and **independent** from implementation.

| Role | Responsibility |
|------|---------------|
| Architecture Judge | FDD compliance, dependency direction, separation of concerns |
| Angular/TypeScript Judge | Angular 20 APIs, TypeScript strictness, signals usage |
| UI/UX Judge | Design system compliance, responsive behavior, accessibility |
| Code Quality Judge | Single responsibility, naming, testability |
| Final Judge | Acceptance criteria conformance |

**Judges are READ-ONLY.** They inspect, analyze, and report. They do NOT edit, write, refactor, or fix code.

---

## 11. Fix Loop

```
IMPLEMENTATION → JUDGE → FAIL → FIX AGENT → JUDGE AGAIN
```

The fix agent may ONLY address identified findings. No unrelated refactoring.

---

## 12. Final Acceptance

A task is complete only when:
- All mandatory requirements met
- No unresolved CRITICAL findings
- No unresolved HIGH findings
- Required judges PASS
- Build verified
- Tests verified (where applicable)

If a MEDIUM finding remains, the user must explicitly accept it.

---

## 13. Prototype Debt Classification

### Acceptable Demo Debt
- JSON Server
- Mock data
- Simplified auth
- Placeholder integrations

### Dangerous Architectural Debt
- UI tightly coupled to fake API
- Feature-to-feature coupling
- Duplicated business rules
- Inaccessible architecture
- Irreversible design decisions
- Massive component monoliths

**Dangerous debt MUST be reported.**

---

## 14. Change Safety

Before modifying a file:
1. Read it
2. Understand dependencies
3. Understand its role
4. Determine if other files depend on it
5. Determine if change is scoped
6. Modify minimally

Do not rewrite files unnecessarily. No drive-by refactoring.

---

## 15. Verification Commands

```bash
# Build
npm run build

# Test
npm run test

# Lint (if configured)
ng lint

# Dev server
npm run dev    # Starts Angular + JSON Server concurrently
```

---

*This document is the operational contract. Every AI agent working in this repository MUST follow these rules.*

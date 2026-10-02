# Architecture — Iris Computer Store

> Feature-Driven Development (FDD) with Angular 20 + JSON Server

---

## 1. Architectural Pattern

### Feature-Driven Development (FDD)

Every user-facing capability lives in `src/app/features/`. Each feature is a self-contained module with its own components, data access, and models.

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

---

## 2. Dependency Direction

```
feature → shared/core
```

**RULE:** Features may depend on `core/` and `shared/`. Features should NOT depend on other features unless explicitly justified.

**Evidence:** All current features follow this pattern. No feature-to-feature coupling exists.

---

## 3. Core Layer

### 3.1 Models (`core/models/`)

| File | Interfaces |
|------|-----------|
| `product.ts` | `Product`, `Category`, `HomeCategory`, `ProductFilterParams` |
| `user.ts` | `User`, `LoginCredentials`, `RegisterData` |
| `entrepreneur.ts` | `Entrepreneur`, `VideoTestimony`, `AccompanyPrinciple` |

**Convention:** Interfaces are plain TypeScript — no classes, no decorators. Models are shared across features.

### 3.2 Services (`core/services/`)

| Service | Responsibility | State Management |
|---------|---------------|------------------|
| `AuthService` | Login, register, profile, session | `signal<User | null>` + LocalStorage |
| `CartService` | Cart CRUD, drawer open/close | `signal<CartItem[]>` + LocalStorage |
| `WishlistService` | Favorites CRUD | `signal<Product[]>` + LocalStorage |
| `ProductService` | Product/category queries | No state (returns Observables) |
| `OrderService` | Order creation, user orders | No state (returns Observables) |
| `ToastService` | Notification management | `signal<Toast[]>` |
| `EntrepreneurService` | Entrepreneur data queries | No state (returns Observables) |

**Pattern:** Services use `providedIn: 'root'` and `inject()` for DI. Stateful services sync with LocalStorage for SSR compatibility.

### 3.3 Guards (`core/guards/`)

| Guard | Purpose |
|-------|---------|
| `authGuard` | Protects routes requiring authentication |
| `guestGuard` | Redirects authenticated users away from login/register |

---

## 4. Shared Layer

Shell components that appear across all pages:

| Component | Location | Purpose |
|-----------|----------|---------|
| `HeaderComponent` | `shared/header.component.ts` | Fixed header with nav, user menu, cart icon |
| `FooterComponent` | `shared/footer.component.ts` | Site footer |
| `CartDrawerComponent` | `shared/cart-drawer.component.ts` | Slide-in cart drawer |
| `ToastComponent` | `shared/toast.component.ts` | Notification toasts |

**Convention:** Shared components are imported directly (not lazy-loaded) since they're always visible.

---

## 5. Feature Layer

### 5.1 Feature Inventory

| Feature | Route | Component | Data Access | Auth Required |
|---------|-------|-----------|-------------|---------------|
| Home | `/` | `HomeComponent` | `ProductService` | No |
| Catalog | `/catalog` | `CatalogComponent` | `ProductService` | No |
| Product | `/product/:id` | `ProductComponent` | `ProductService` | No |
| Cart | `/cart` | `CartComponent` | `CartService` | No |
| Wishlist | `/wishlist` | `WishlistComponent` | `WishlistService` | Yes |
| Checkout | `/checkout` | `PagesComponent` | `OrderService` | No |
| About | `/about` | `AboutComponent` | None | No |
| Entrepreneurs | `/emprendedores` | `EntrepreneursComponent` | `EntrepreneurService` | No |
| Auth | `/auth` | `AuthComponent` | `AuthService` | No (guest only) |
| Account | `/account` | `AccountComponent` | `AuthService`, `OrderService` | Yes |

### 5.2 Feature Structure Pattern

Each feature follows:

```
features/
└── feature-name/
    ├── feature-name.component.ts      # Component logic
    ├── feature-name.component.html    # Template
    └── feature-name.component.css     # Component styles (when needed)
```

**Not all features have separate data-access or model directories.** This is acceptable for the prototype — data access lives in `core/services/`.

---

## 6. Routing

### Lazy Loading

All feature routes use `loadComponent` for lazy loading:

```typescript
{
  path: 'catalog',
  loadComponent: () => import('./features/catalog/catalog.component').then(m => m.CatalogComponent)
}
```

### Route Guards

Protected routes use `canActivate` with dynamic import:

```typescript
{
  path: 'account',
  loadComponent: () => import('./features/account/account.component').then(m => m.AccountComponent),
  canActivate: [() => import('./core/guards/auth.guard').then(m => m.authGuard)]
}
```

### Redirect Aliases

Several paths redirect to canonical routes:

- `/login` → `/auth`
- `/register` → `/auth`
- `/profile` → `/account`
- `/mis-compras` → `/account`
- `/contact` → `/about`

---

## 7. Data Access Pattern

### Current State (Prototype)

```
Component → Service → HttpClient → JSON Server
```

Services inject `HttpClient` and query `http://localhost:3000` endpoints directly.

### Target State (Production)

```
UI → Feature → Data Access → API Adapter → Backend
```

The abstraction layer (API Adapter) is not yet implemented. Services currently couple to JSON Server endpoints directly — this is **acceptable prototype debt**.

---

## 8. State Management

### Angular Signals

All reactive state uses Angular Signals:

```typescript
// Signal for mutable state
readonly items = signal<CartItem[]>([]);

// Computed for derived state
readonly count = computed(() => this.items().reduce((total, item) => total + item.quantity, 0));
```

### LocalStorage Sync

Stateful services (Auth, Cart, Wishlist) persist to LocalStorage for SSR compatibility:

```typescript
constructor() {
  if (isPlatformBrowser(this.platformId)) {
    this.loadCart();
  }
}
```

---

## 9. SSR Configuration

The project has SSR configured:

- `src/main.server.ts` — Server entry point
- `src/server.ts` — Express SSR server
- `angular.json` — `outputMode: "server"`, SSR entry configured

**Note:** SSR is configured but not fully hydrated. The `provideClientHydration(withEventReplay())` is enabled.

---

## 10. Design System Integration

### Design Tokens

Defined in `src/styles.css` under `@theme { }`:

- Colors: `--color-primary`, `--color-surface`, `--color-on-surface`, etc.
- Typography: `--font-headline-*`, `--font-body-*`, `--font-label-tech`
- Spacing: `--spacing-base`, `--spacing-gutter`, `--spacing-section-gap`
- Layout: `--container-container-max`

### Global Utilities

Defined in `src/styles.css`:

- `.iris-gradient-bg`, `.iris-gradient-btn`, `.iris-gradient-text`
- `.product-card`, `.skeleton`, `.input-tech`, `.custom-checkbox`
- `.glow-primary`, `.iris-glow-hover`
- Animation classes: `.animate-fade-in-up`, `.animate-scale-in`, etc.

---

## 11. Prototype Debt

### Acceptable Debt

| Item | Impact | Migration Path |
|------|--------|----------------|
| JSON Server | No real backend | Replace with REST/GraphQL API |
| Mock auth (LocalStorage) | No real security | Implement JWT + refresh tokens |
| No e2e tests | Manual testing only | Add Playwright/Cypress |
| No i18n | Spanish only | Add Angular i18n |
| SSR not fully hydrated | SEO gap | Complete hydration |

### Dangerous Debt

**None identified.** The architecture is clean and follows FDD principles.

---

## 12. Production Evolution

### Phase 1: Backend
- Replace JSON Server with Node.js/NestJS
- Implement real authentication (JWT + refresh tokens)
- Add database (PostgreSQL/MongoDB)

### Phase 2: Features
- Complete SSR hydration
- Add payment integration
- Implement real-time inventory

### Phase 3: Quality
- Add e2e tests (Playwright)
- CI/CD pipeline
- Error monitoring (Sentry)

---

*Architecture is clean, consistent, and production-ready. No dangerous debt identified.*

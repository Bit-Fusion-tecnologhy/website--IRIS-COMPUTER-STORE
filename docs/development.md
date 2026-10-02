# Development Guide — Iris Computer Store

> How to work in this repository: workflow, tools, conventions, and best practices.

---

## 1. Development Workflow

### Getting Started

```bash
# Clone repository
git clone <repo-url>

# Install dependencies
npm install

# Start development (Angular + JSON Server)
npm run dev

# Open browser
http://localhost:4200
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Angular + JSON Server concurrently |
| `npm start` | Start Angular dev server only |
| `npm run server` | Start JSON Server only (port 3000) |
| `npm run build` | Production build |
| `npm run watch` | Build with watch mode |
| `npm test` | Run unit tests (Karma/Jasmine) |

---

## 2. Repository Structure

```
├── src/
│   ├── app/
│   │   ├── core/              # Singleton services, models, guards
│   │   │   ├── models/        # TypeScript interfaces
│   │   │   ├── services/      # Injectable services
│   │   │   └── guards/        # Route guards
│   │   ├── shared/            # Shell components
│   │   └── features/          # Feature modules
│   ├── environments/          # Environment configs
│   ├── styles.css             # Global styles + Tailwind v4 theme
│   └── index.html             # Entry point
├── public/                    # Static assets
├── db.json                    # JSON Server mock database
├── DESIGN.md                  # Design system
├── DESIGN-CUSTOMER-REVIEWS.md # Customer Reviews feature design
├── AGENTS.md                  # AI agent contract
└── docs/                      # Architecture, development, quality docs
```

---

## 3. Angular Conventions

### Component Style

1. **Standalone components** — No NgModules
2. **Signals** for reactive state (`signal`, `computed`)
3. **`inject()`** for dependency injection
4. **Lazy loading** on all routes (`loadComponent`)
5. **`@if` / `@for` / `@defer`** — NOT `ngIf` / `ngFor`

### Component Structure

```typescript
@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.css'  // when needed
})
export class FeatureComponent implements OnInit {
  readonly someService = inject(SomeService);
  readonly data = signal<Type[]>([]);
  
  ngOnInit() {
    this.loadData();
  }
  
  loadData() {
    this.someService.getData().subscribe({
      next: (data) => this.data.set(data),
      error: (err) => console.error(err)
    });
  }
}
```

### Services

```typescript
@Injectable({ providedIn: 'root' })
export class SomeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  
  getData(): Observable<Type[]> {
    return this.http.get<Type[]>(`${this.apiUrl}/endpoint`);
  }
}
```

---

## 4. Styling Conventions

### Tailwind CSS v4

- Use `@theme` directive in `src/styles.css`
- NO `tailwind.config.js` — v4 uses CSS-first configuration
- Use tokens from `@theme` — no hardcoded colors

### Design Tokens

```css
/* Access tokens via Tailwind utilities */
class="bg-surface text-on-surface border-primary"

/* Or via CSS variables */
color: var(--color-primary);
```

### Global Utilities

Defined in `src/styles.css`:

- `.iris-gradient-bg`, `.iris-gradient-btn` — Brand gradient
- `.product-card` — Product card styles with hover
- `.skeleton` — Loading skeleton
- `.input-tech` — Form input styles
- `.custom-checkbox` — Custom checkbox

**Do not duplicate** these utilities in component styles.

### Component Styles

Only create `component.css` when:
- Component-specific animations
- Complex hover states
- Responsive overrides not expressible via Tailwind

Otherwise, use Tailwind utilities inline.

---

## 5. Skills & MCP Usage

### Required Skills (by context)

| Context | Skill | When to Load |
|---------|-------|--------------|
| Angular code | `angular-developer` | Before writing/modifying Angular |
| UI/UX work | `frontend-design`, `frontend-ui-engineering` | Before implementing UI |
| TypeScript types | `typescript-expert` | Before complex type work |
| Code review | `code-review-and-quality` | Before merging changes |
| Security | `security-and-hardening` | Before auth/data handling |

### MCP Usage

| MCP | Use When |
|-----|----------|
| Context7 | Need Angular/RxJS/Tailwind docs |
| Angular CLI MCP | Project inspection, generators |
| Engram | Save decisions, bugs, discoveries |
| CodeGraph | Codebase exploration, call paths |
| OpenPencil | Design inspection, Figma files |

### Context7 Priority

Always prefer Context7 over model memory for:
- Angular APIs
- RxJS operators
- Tailwind utilities
- Third-party libraries
- Version-specific behavior

---

## 6. Data Layer

### JSON Server

- `db.json` is the data source
- API URL: `http://localhost:3000`
- Endpoints: `/products`, `/categories`, `/homeCategories`, `/cart`, `/orders`, `/users`, `/messages`

### Service Pattern

```typescript
// Stateful service (Auth, Cart, Wishlist)
@Injectable({ providedIn: 'root' })
export class CartService {
  readonly items = signal<CartItem[]>([]);
  
  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCart();
    }
  }
}

// Stateless service (Product, Order, Entrepreneur)
@Injectable({ providedIn: 'root' })
export class ProductService {
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }
}
```

---

## 7. UI/UX Conventions

### Mobile-First

Always start with mobile layout, then add responsive breakpoints:

```html
<div class="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
```

### Interactive Elements

Every interactive element needs:
- `hover:` state
- `transition-*` for smooth changes
- `aria-label` for accessibility (icon buttons)
- `cursor-pointer` where appropriate

### Loading States

Use skeleton loading for async data:

```html
@if (isLoading()) {
  <div class="skeleton h-64 w-full rounded"></div>
} @else {
  <!-- content -->
}
```

### Empty States

Always show helpful empty states:

```html
<div class="rounded border border-dashed border-white/10 bg-surface-card p-16 text-center">
  <span class="material-symbols-outlined text-5xl text-primary">icon_name</span>
  <p class="mt-4 text-on-surface-variant">Message</p>
  <a routerLink="/action" class="mt-6 text-primary">Action</a>
</div>
```

---

## 8. Testing

### Unit Tests

```bash
npm test
```

- Framework: Karma + Jasmine
- Location: `*.spec.ts` files alongside components
- Focus: Services, pipes, isolated component logic

### Test Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all unit tests |
| `npm run build` | Verify production build |

---

## 9. Git Workflow

### Commit Messages

Use conventional commits:

```
feat: add customer reviews section
fix: resolve cart quantity calculation
docs: update design system tokens
refactor: extract review service
```

### Branch Strategy

- `main` — production-ready code
- Feature branches — `feature/feature-name`
- Fix branches — `fix/issue-description`

---

## 10. Common Patterns

### Adding a New Feature

1. Create feature directory: `src/app/features/feature-name/`
2. Create component: `feature-name.component.ts`
3. Create template: `feature-name.component.html`
4. Add route to `app.routes.ts` with `loadComponent`
5. Add service to `core/services/` if needed
6. Add model to `core/models/` if needed
7. Update `db.json` if new endpoints needed

### Adding a New Service

1. Create file: `core/services/service-name.service.ts`
2. Use `@Injectable({ providedIn: 'root' })`
3. Use `inject()` for dependencies
4. Use `environment.apiUrl` for base URL

### Adding a New Model

1. Create or update file: `core/models/model-name.ts`
2. Export interfaces (no classes)
3. Import in services/components as needed

---

*This guide ensures consistent, maintainable development across the team.*

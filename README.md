# Iris Computer Store

> **Client Demo / Prototype** — Angular 20 + Tailwind CSS v4 + JSON Server

E-commerce prototype for **Iris Computer** (Santa Cruz, Bolivia) — demonstrating product catalog, shopping cart, checkout, user accounts, and entrepreneur stories for client validation.

---

## Purpose

This prototype validates:

- Product vision and UX workflows
- Information architecture
- Design system (dark theme, gaming aesthetic)
- Future production evolution path

**Not disposable code** — architecture preserves clean migration to production.

---

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Angular | 20.3 | Frontend framework (LTS) |
| TypeScript | 5.9 | Type safety (strict mode) |
| Tailwind CSS | 4.2 | Styling (v4 with `@theme`) |
| JSON Server | 1.0.0-beta.15 | Mock REST API |
| Express | 5.1 | SSR server |
| RxJS | 7.8 | Reactive state |
| Karma/Jasmine | 6.4 / 5.9 | Unit testing |

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development (Angular + JSON Server concurrently)
npm run dev

# Open browser
http://localhost:4200
```

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Angular dev server + JSON Server (port 3000) |
| `npm start` | Start Angular dev server only |
| `npm run server` | Start JSON Server only (port 3000) |
| `npm run build` | Production build |
| `npm test` | Run unit tests |

---

## Architecture

### Feature-Driven Development (FDD)

```
src/app/
├── core/           # Singleton services, models, guards
│   ├── models/     # TypeScript interfaces (Product, User, Entrepreneur)
│   ├── services/   # AuthService, CartService, ProductService, etc.
│   └── guards/     # authGuard, guestGuard
├── shared/         # Shell components (header, footer, toast, cart-drawer)
└── features/       # Feature modules (lazy-loaded)
    ├── home/       # Landing page
    ├── catalog/    # Product listing with filters
    ├── product/    # Product detail page
    ├── cart/       # Shopping cart
    ├── wishlist/   # Favorites
    ├── auth/       # Login/Register
    ├── account/    # User profile + order history
    ├── about/      # About page
    ├── entrepreneurs/ # Entrepreneur stories
    └── pages/      # Checkout, contact
```

### Dependency Direction

```
feature → shared/core (never feature → feature)
```

### Data Layer

```
UI → Feature → Data Access → API Adapter → JSON Server (db.json)
```

---

## Features

- **Product Catalog** — Filter by category, brand, specs, price; sort options; skeleton loading
- **Product Detail** — Image gallery, specs, add to cart/wishlist
- **Shopping Cart** — Drawer with quantity controls, persistent state
- **Checkout** — Multi-step form, auto-fill for logged-in users
- **Authentication** — Login/Register with JWT-like session (LocalStorage)
- **User Account** — Profile, order history, shipping data
- **Wishlist** — Favorites with LocalStorage persistence
- **Entrepreneur Stories** — Dedicated section for entrepreneur profiles
- **Responsive Design** — Mobile-first with desktop optimization

---

## Design System

See `DESIGN.md` for complete design tokens, components, and patterns.

Key design elements:
- **Dark theme** with cool grays (#121319 → #383940)
- **Brand gradient** — `linear-gradient(135deg, #3f51b5 0%, #f44336 100%)`
- **Typography** — Sora (headlines), Hanken Grotesk (body), JetBrains Mono (labels)
- **Icons** — Material Symbols Outlined
- **Glassmorphism** — backdrop-blur on header, drawers, badges

---

## Current Limitations

- **JSON Server** — no real backend, no authentication tokens
- **Simplified auth** — session stored in LocalStorage, no real JWT
- **Mock data** — products, orders, users are demo data
- **No SSR hydration** — SSR is configured but not fully exercised
- **No e2e tests** — only unit tests via Karma/Jasmine
- **No i18n** — Spanish only (es)

---

## Future Production Path

1. **Backend** — Replace JSON Server with real API (Node.js/NestJS or similar)
2. **Auth** — Implement real JWT with refresh tokens
3. **Database** — PostgreSQL or MongoDB with proper ORM
4. **Payments** — Integrate payment gateway (Stripe, local providers)
5. **SSR** — Complete SSR hydration for SEO
6. **Testing** — Add Playwright/Cypress for e2e
7. **CI/CD** — GitHub Actions pipeline
8. **Monitoring** — Sentry or similar error tracking

---

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── core/           # Services, models, guards
│   │   ├── shared/         # Shell components
│   │   └── features/       # Feature modules
│   ├── environments/       # Environment configs
│   ├── styles.css          # Global styles + Tailwind v4 theme
│   └── index.html          # Entry point (Google Fonts, Material Symbols)
├── public/                 # Static assets (logo, favicon)
├── db.json                 # JSON Server mock database
├── AGENTS.md               # AI agent operational contract
└── docs/                   # Architecture, design system, development, quality docs                  
```

---

## License

Private — Iris Computer

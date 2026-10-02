# DESIGN.md — Iris Computer Design System

> **Contrato visual para el proyecto Iris Computer.**
> Fuente de verdad: `src/styles.css`, componentes Angular, clases Tailwind v4.
> Última actualización: Septiembre 2026.

---

## 1. Brand Identity

| Propiedad | Valor |
|-----------|-------|
| **Nombre** | Iris Computer |
| **Tagline** | "Ingeniería de Precisión" / "Engineered for Performance" |
| **Gradiente de marca** | `linear-gradient(135deg, #3f51b5 0%, #f44336 100%)` |
| **Logo** | `/logo/iris.jpeg` (imagen raster, no SVG) |
| **Favicon** | `/logo/iris.ico` |
| **Idioma** | Español (es) — `index.html lang="es"` |

### Personalidad Visual

- **Oscura** — Tema dark-first con superficies en escala de grises fríos (#121319 → #383940)
- **Técnica** — JetBrains Mono para labels, iconos Material Symbols, vocabulario de ingeniería
- **Premium** — Gradientes sutiles, sombras de marca, glassmorphism (backdrop-blur)
- **Minimalista** — Bordes finos (white/10), espaciado generoso, sin clutter
- **De ingeniería** — Tono de precisión, componentes, especificaciones técnicas

---

## 2. Color Palette & Tokens

Definidos en `src/styles.css` bajo `@theme { }`.

### Superficies (escala oscura)

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-background` | `#121319` | Body background |
| `--color-surface` | `#121319` | Superficie base |
| `--color-surface-dark` | `#0a0a0c` | Footer, overlays oscuros |
| `--color-surface-bright` | `#383940` | Hover states, elementos elevados |
| `--color-surface-card` | `#16161a` | Cards, drawers, modales |
| `--color-surface-container-lowest` | `#0d0e14` | Profundidad mínima |
| `--color-surface-container-low` | `#1a1b22` | Inputs, contenedores internos |
| `--color-surface-container` | `#1f1f26` | Contenedores neutros |
| `--color-surface-container-high` | `#292930` | Headers de drawer, badges sutiles |
| `--color-surface-container-highest` | `#34343b` | Elementos más elevados |

### Texto

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-on-surface` | `#e3e1ea` | Texto principal |
| `--color-on-surface-variant` | `#c5c5d4` | Texto secundario, labels, placeholders |

### Marca

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-primary` | `#bac3ff` | Links, badges, price highlights, focus states |
| `--color-on-primary` | `#08218a` | Texto sobre primary sólido |
| `--color-primary-container` | `#3f51b5` | Fondos primarios sólidos, avatares |
| `--color-secondary` | `#ffb4a9` | Tags alternos en categorías home |

### Estados

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-error` | `#ffb4ab` | Texto de error, bordes de error |
| `--color-error-container` | `#93000a` | Fondos de error, badges de "Oferta" |
| `--color-on-error-container` | `#ffdad6` | Texto sobre error-container |
| `--color-outline-variant` | `#454652` | Borders globales (`* { border-color }`) |
| `--color-accent-cyan` | `#17a2b8` | Stock dots, pulse animations, online status |

### Gradientes Globales

| Clase CSS | Valor | Uso |
|-----------|-------|-----|
| `.iris-gradient-bg` | `linear-gradient(135deg, #3f51b5 0%, #f44336 100%)` | Fondos de botones primarios |
| `.iris-gradient-btn` | Igual al anterior | Botones CTA principales |
| `.iris-gradient-text` | Mismo gradiente + `background-clip: text` | Texto de marca "Iris Computer" |
| `@utility bg-iris-gradient` | Igual | Utility Tailwind custom |

### Colores Hardcodeados en Template (no en tokens)

| Color | Uso | Ubicación |
|-------|-----|-----------|
| `rgba(63, 81, 181, 0.15)` | Glow hover `.iris-glow-hover` | styles.css |
| `rgba(63, 81, 181, 0.25)` | Shadow hover `.product-card:hover` | styles.css |
| `rgba(186, 195, 255, 0.7)` | Glow tab active `::after` | header.component.css |
| `rgba(23, 162, 184, 0.7)` | Pulse animation (stock dot) | styles.css |
| `#3F51B5` | Radial gradient backgrounds (about, catalog) | about.component.html, catalog.component.html |
| `green-400` | Check icons, SSL shield | product.component.html, pages.component.html |
| `amber-400` | Warning toast icon | toast.component.html |
| `error` (Tailwind) | Error states, delete hover | Múltiples componentes |

---

## 3. Typography

### Fuentes (cargadas en `index.html`)

| Fuente | Pesos | CSS Token | Uso |
|--------|-------|-----------|-----|
| **Sora** | 400, 600, 700 | `--font-headline-*` | Headlines, títulos, precios |
| **Hanken Grotesk** | 400, 500, 600 | `--font-body-*` | Body text, descripciones |
| **JetBrains Mono** | 400, 500, 700 | `--font-label-tech` | Labels, tabs, badges, breadcrumbs |

### Scale de Headlines

| Token | Tamaño | Line-height | Peso | Ejemplo de uso |
|-------|--------|-------------|------|----------------|
| `--text-headline-xl` | 48px | 1.1 | 700 | H1 hero, título de página |
| `--text-headline-lg` | 32px | 1.2 | 600 | H2 de sección |
| `--text-headline-lg-mobile` | 24px | 1.2 | 600 | H2 responsive móvil |
| `--text-headline-md` | 24px | 1.3 | 600 | H3 de card, subtítulos |
| `--text-price-display` | 28px | 1.0 | 700 | Precios destacados |

### Scale de Body

| Token | Tamaño | Line-height | Uso |
|-------|--------|-------------|-----|
| `--text-body-lg` | 18px | 1.6 | Lead text, descripciones largas |
| `--text-body-md` | 16px | 1.5 | Body general, párrafos |

### Scale de Labels

| Token | Tamaño | Line-height | Letter-spacing | Uso |
|-------|--------|-------------|----------------|-----|
| `--text-label-tech` | 12px | 1.0 | 0.05em | Tabs nav, badges, breadcrumbs, CTA buttons |

### Tamaños Ad-hoc (en templates)

| Tamaño | Clases Tailwind | Uso |
|--------|-----------------|-----|
| 10px | `text-[10px]` | Labels de formularios, brands secundarios |
| 11px | `text-[11px]` | Filter chips, precio de envío |
| 9px | `text-[9px]` / `text-[9px] sm:text-[10px]` | Badges de producto (muy compacto) |

### Transformación de Texto

- **Uppercase**: `text-uppercase` / `uppercase` en labels, tabs, badges, breadcrumbs, CTA buttons
- **Tracking**: `tracking-widest` (badges), `tracking-wider` (CTA buttons), `tracking-widest` + `letter-spacing: 0.05em` (label-tech)

---

## 4. Spacing & Layout

### Tokens de Espaciado

| Token | Valor | Tailwind equiv. | Uso |
|-------|-------|-----------------|-----|
| `--spacing-base` | 8px | `2` | Unidad base del sistema |
| `--spacing-gutter` | 24px | `6` | Padding horizontal del contenedor |
| `--spacing-section-gap` | 80px | N/A (custom) | Separación vertical entre secciones |

### Contenedor

| Token | Valor | Clase |
|-------|-------|-------|
| `--container-container-max` | 1280px | `max-w-container-max` |

### Layout Pattern

```html
<main class="bg-surface pt-20">
  <section class="mx-auto max-w-container-max px-gutter py-section-gap">
    <!-- contenido -->
  </section>
</main>
```

### Padding Top de Páginas

| Página | Padding | Razón |
|--------|---------|-------|
| Home | `pt-20` (80px) | Header fijo h-20 |
| Catalog | `pt-20` | Header fijo |
| Product | `pt-32` (128px) | Más espacio para breadcrumbs |
| About | `pt-24` (96px) | Hero con badge superior |
| Cart | `pt-[104px]` | Tailwind arbitrary |
| Wishlist | `pt-28` (112px) | Espacio para header |
| Checkout | `pt-28` | Espacio para header |
| Contact | `pt-32` | Espacio para header |

---

## 5. Breakpoints

| Breakpoint | Tailwind prefix | Ancho | Uso |
|------------|----------------|-------|-----|
| `sm` | `sm:` | 640px | Texto brand visible, grid 2 col estable |
| `md` | `md:` | 768px | Nav desktop, grid 3 col, layout flex-row |
| `lg` | `lg:` | 1024px | Grid 4 col, grid 2 col sidebar |
| `xl` | `xl:` | 1280px | Grid 4 col completo |

### Responsive Patterns

| Patrón | Móvil (<640) | Tablet (640-1024) | Desktop (>1024) |
|--------|--------------|---------------------|-----------------|
| **Grid productos** | 2 cols | 2 cols | 3-4 cols |
| **Nav** | Hamburger | Hamburger | Tabs horizontales |
| **Filter drawer** | Full-screen | Sidebar 380px | Sidebar 380px |
| **Product detail** | Stack vertical | Stack vertical | 2 cols (gallery + info) |
| **Cart** | Stack vertical | Stack vertical | 2 cols (items + summary) |
| **Checkout** | Stack vertical | Stack vertical | 2 cols (form + summary) |

---

## 6. Componentes Reutilizables

### 6.1 Atoms

#### Button Primary (`.iris-gradient-btn`)
```html
<a class="iris-gradient-btn flex items-center gap-2 px-8 py-4 font-label-tech text-xs uppercase font-bold text-white tracking-wider transition-all hover:brightness-110 rounded">
  <span>Texto</span>
  <span class="material-symbols-outlined text-[18px]">icon_name</span>
</a>
```
- **Variante glow**: Agregar `hover:shadow-[0_0_20px_rgba(63,81,181,0.4)]`
- **Variante scale**: Agregar `transition-transform hover:scale-[1.02]`

#### Button Secondary
```html
<a class="rounded border border-white/20 bg-surface-card px-6 py-4 font-label-tech text-xs uppercase font-bold text-on-surface hover:border-primary transition-colors">
  Texto
</a>
```

#### Button Ghost (Filtros)
```html
<button class="flex items-center gap-2 rounded border border-primary/40 bg-surface-card px-4 py-2.5 font-label-tech text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary/10 transition-colors">
  <span class="material-symbols-outlined text-base">icon</span>
  <span>Texto</span>
</button>
```

#### Icon Button (Carrito, Wishlist, Acciones)
```html
<button class="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded border border-primary text-primary transition-all hover:bg-primary hover:text-white">
  <span class="material-symbols-outlined text-xs sm:text-sm">icon_name</span>
</button>
```

#### Icon Button Circula (Wishlist toggle, Thumbnail nav)
```html
<button class="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-surface/80 border border-white/10 text-on-surface-variant hover:text-primary hover:border-primary/50 backdrop-blur transition-all">
  <span class="material-symbols-outlined text-sm">icon_name</span>
</button>
```

---

### 6.2 Cards

#### Product Card (`.product-card` — definido en `styles.css`)
```html
<article class="product-card group relative flex flex-col overflow-hidden rounded border border-white/10 bg-surface-card transition-all hover:border-primary/50">
  <!-- Top gradient bar (hidden, appears on hover via CSS) -->
  <div class="iris-gradient-bg absolute top-0 left-0 h-[2px] w-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

  <!-- Badge (top-left) -->
  <span class="absolute top-2 left-2 z-10 bg-primary px-2 py-0.5 rounded font-label-tech text-[10px] uppercase tracking-wider text-white">Badge</span>

  <!-- Wishlist button (top-right) -->
  <button class="absolute top-2 right-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-surface/80 border border-white/10 backdrop-blur">...</button>

  <!-- Image container -->
  <a class="relative flex h-36 sm:h-60 w-full items-center justify-center bg-surface p-2 sm:p-4">
    <img class="h-full w-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105" />
  </a>

  <!-- Info container -->
  <div class="flex flex-1 flex-col border-t border-white/10 p-3 sm:p-5">
    <span class="font-label-tech text-[10px] uppercase text-primary">subtitle</span>
    <h2 class="font-headline-md text-xs sm:text-base leading-tight text-on-surface line-clamp-2">name</h2>
    <div class="mt-auto flex items-end justify-between border-t border-white/5 pt-2 sm:pt-4">
      <span class="font-price-display text-sm sm:text-xl font-bold text-on-surface">$price</span>
      <button class="icon-button-add-cart">add_shopping_cart</button>
    </div>
  </div>
</article>
```

**Hover behavior** (definido en `styles.css`):
- `border-color: var(--color-primary)`
- `transform: translateY(-4px)`
- `box-shadow: 0 10px 30px -10px rgb(63 81 181 / .25)`
- Top gradient bar opacity → 1

#### Category Card (Home)
```html
<a class="group relative flex flex-col justify-end overflow-hidden rounded-sm border border-white/10 bg-surface-card p-6 transition-colors hover:border-primary">
  <!-- Background image (mix-blend-luminosity) -->
  <div class="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-luminosity transition-all duration-700 group-hover:scale-105 group-hover:opacity-80"></div>
  <!-- Gradient overlay -->
  <div class="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/40 to-transparent"></div>
  <!-- Content -->
  <div class="relative z-10">
    <span class="mb-2 block font-label-tech text-label-tech uppercase text-primary">tag</span>
    <h3 class="font-headline-md text-headline-md text-on-surface">name</h3>
  </div>
</a>
```

#### Metric Card (About)
```html
<div class="flex flex-col border border-white/10 bg-surface-card p-6 rounded text-left">
  <span class="font-price-display text-3xl md:text-4xl font-bold text-primary mb-1">+10,000</span>
  <span class="font-label-tech text-xs uppercase text-on-surface">Label</span>
  <p class="mt-2 text-xs text-on-surface-variant">Descripción</p>
</div>
```

#### Pillar Card (About)
```html
<article class="flex flex-col rounded border border-white/10 bg-surface-card p-8 transition-colors hover:border-primary/50">
  <div class="mb-6 flex h-14 w-14 items-center justify-center rounded bg-primary/20 text-primary">
    <i class="material-symbols-outlined text-3xl">icon_name</i>
  </div>
  <h3 class="font-headline-md text-xl font-bold text-on-surface mb-3">Título</h3>
  <p class="text-sm text-on-surface-variant leading-relaxed">Descripción</p>
</article>
```

---

### 6.3 Badges

#### Badge de Producto (top-left)
```html
<!-- Estándar (primary) -->
<span class="bg-primary px-2 py-0.5 rounded font-label-tech text-[10px] uppercase tracking-wider text-white">Badge</span>

<!-- Oferta/Error -->
<span class="bg-error-container text-on-error-container border border-error/20 px-1.5 py-0.5 rounded font-label-tech text-[10px] uppercase tracking-widest">Oferta</span>
```

#### Badge de Stock
```html
<div class="flex items-center gap-1 border border-white/10 bg-surface/80 px-1.5 py-0.5 rounded backdrop-blur">
  <span class="pulse-dot h-1.5 w-1.5"></span>
  <span class="font-label-tech text-[10px] uppercase tracking-wider text-on-surface">En Stock</span>
</div>
```

#### Badge de Filtro Activo
```html
<span class="inline-flex items-center gap-1 rounded bg-primary/20 border border-primary/40 px-2 py-0.5 text-[11px] text-primary">
  Filtro
  <button class="hover:text-white">✕</button>
</span>
```

#### Badge de Contador (Header)
```html
<span class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary font-label-tech text-[10px] font-bold text-white shadow-md animate-pulse">
  3
</span>
```

#### Badge de Brand (Product detail)
```html
<span class="rounded bg-white/5 border border-white/10 px-2 py-0.5 font-label-tech text-[10px] text-on-surface-variant">Brand</span>
```

#### Spec Pill
```html
<!-- En catálogo (variante sutil) -->
<span class="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-[10px] text-on-surface-variant">Spec</span>

<!-- En detalle de producto (variante primaria) -->
<span class="rounded border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary font-label-tech">Spec</span>
```

---

### 6.4 Inputs

#### Input Tech (`.input-tech` — definido en `styles.css`)
```css
.input-tech {
  background: var(--color-surface-card);
  border: 0;
  border-bottom: 1px solid var(--color-outline-variant);
}
.input-tech:focus {
  outline: 0;
  border-bottom-color: var(--color-primary);
}
```

**En uso real** (Checkout, Contact): Los inputs usan variante border-only:
```html
<input class="w-full rounded border border-white/10 bg-surface px-4 py-2 text-xs text-on-surface focus:border-primary focus:outline-none" />
```

#### Select
```html
<select class="appearance-none rounded border border-white/10 bg-surface-card px-3 py-1.5 text-xs text-on-surface outline-none focus:border-primary">
  <option>Opción</option>
</select>
```

#### Textarea
```html
<textarea class="w-full rounded border border-white/10 bg-surface px-4 py-2.5 text-xs text-on-surface focus:border-primary focus:outline-none" rows="5"></textarea>
```

#### Label de Formulario
```html
<label class="font-label-tech text-[10px] uppercase text-on-surface-variant block mb-1">Label *</label>
```

#### Custom Checkbox (`.custom-checkbox` — definido en `styles.css`)
```html
<input type="checkbox" class="custom-checkbox h-4 w-4 accent-primary rounded cursor-pointer" />
```
- `appearance: none` con clip-path de check mark
- Scale animation al checkear
- Border `primary` cuando checked

---

### 6.5 Navigation

#### Header (Fixed)
```html
<header class="fixed top-0 z-50 w-full border-b border-white/10 bg-surface/80 shadow-sm backdrop-blur-md">
  <div class="mx-auto flex h-20 max-w-container-max items-center justify-between px-gutter">
    <!-- Logo + Brand text -->
    <!-- Desktop nav tabs -->
    <!-- Action icons -->
  </div>
  <!-- Mobile dropdown (conditional) -->
</header>
```

#### Tab de Navegación (Desktop)
```css
.header-tab {
  font-family: var(--font-label-tech);
  font-size: var(--text-label-tech);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-on-surface-variant);
  transition: color 0.2s ease;
}
.header-tab:hover { color: var(--color-on-surface); }
.header-tab.active-tab {
  color: var(--color-primary);
  font-weight: 700;
}
.header-tab.active-tab::after {
  /* Bottom bar: gradient de marca con glow */
  background: linear-gradient(135deg, #3f51b5 0%, #bac3ff 100%);
  box-shadow: 0 0 10px rgba(186, 195, 255, 0.7);
}
```

#### Mobile Nav Link
```html
<a class="mobile-nav-link" routerLinkActive="mobile-active-tab">
  <i class="material-symbols-outlined text-base">icon</i>
  Label
</a>
```
- `border-left: 3px solid transparent` → `primary` en active
- `bg-primary/8` en active

#### Breadcrumb
```html
<div class="flex items-center gap-2 font-label-tech text-[10px] sm:text-xs uppercase text-on-surface-variant">
  <a routerLink="/" class="hover:text-primary transition-colors">Inicio</a>
  <i class="material-symbols-outlined text-[10px]">chevron_right</i>
  <a class="hover:text-primary transition-colors">Productos</a>
  <i class="material-symbols-outlined text-[10px]">chevron_right</i>
  <span class="text-primary">Actual</span>
</div>
```

---

### 6.6 Drawers / Modales

#### Overlay Pattern
```html
<div class="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"></div>
```

#### Drawer Sidebar (Cart, Filters)
```html
<aside class="fixed top-0 right-0 z-70 flex h-full w-full flex-col border-l border-white/10 bg-surface-card shadow-2xl overscroll-contain sm:w-[450px] animate-slide-right">
  <!-- Header sticky -->
  <header class="flex shrink-0 items-center justify-between border-b border-white/10 p-6 bg-surface">...</header>
  <!-- Body scrollable -->
  <div class="flex-1 space-y-6 overflow-y-auto overscroll-contain p-6">...</div>
  <!-- Footer sticky -->
  <footer class="shrink-0 border-t border-white/10 bg-surface-container p-6">...</footer>
</aside>
```

#### Scroll Lock
- Se aplica `document.body.style.overflow = 'hidden'` al abrir
- Se restaura al cerrar
- Implementado en `CartService` y `CatalogComponent`

---

### 6.7 Estados Loading / Error / Empty

#### Loading — Skeleton Shimmer
```html
<div class="skeleton h-64 w-full rounded"></div>
```
**CSS** (definido en `styles.css`):
```css
.skeleton {
  background: linear-gradient(90deg, #1a1b22 25%, #2a2b36 50%, #1a1b22 75%);
  background-size: 200% 100%;
  animation: shimmer 1.8s infinite ease-in-out;
}
```

**Skeleton Grid Pattern** (Product cards loading):
```html
<div class="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
  @for (item of [1, 2, 3, 4]; track item) {
    <div class="flex flex-col rounded border border-white/10 bg-surface-card p-4">
      <div class="skeleton mb-4 aspect-[4/3] rounded"></div>
      <div class="skeleton h-3 w-1/3 mb-2 rounded"></div>
      <div class="skeleton h-4 w-3/4 mb-4 rounded"></div>
      <div class="mt-auto flex justify-between pt-4 border-t border-white/5">
        <div class="skeleton h-5 w-1/3 rounded"></div>
        <div class="skeleton h-8 w-8 rounded-full"></div>
      </div>
    </div>
  }
</div>
```

#### Error State
```html
<div class="p-8 border border-error/30 bg-error-container/20 rounded text-center my-8 animate-fade-in-up">
  <i class="material-symbols-outlined text-4xl text-error mb-2">cloud_off</i>
  <h3 class="text-lg font-bold text-on-surface mb-2">Título de error</h3>
  <p class="text-sm text-on-surface-variant max-w-md mx-auto mb-4">Mensaje descriptivo</p>
  <button class="iris-gradient-btn px-6 py-2 rounded text-xs font-bold text-white uppercase tracking-wider">Reintentar</button>
</div>
```

#### Empty State
```html
<div class="rounded border border-dashed border-white/10 bg-surface-card p-16 text-center">
  <span class="material-symbols-outlined text-5xl text-primary mb-2">icon_name</span>
  <p class="mt-4 text-on-surface-variant">Mensaje descriptivo</p>
  <a routerLink="/catalog" class="mt-6 inline-flex items-center gap-2 text-primary">
    Acción <span class="material-symbols-outlined">arrow_forward</span>
  </a>
</div>
```

---

## 7. Iconography

### Material Symbols Outlined

```html
<span class="material-symbols-outlined">icon_name</span>
```

**Configuración** (definida en `index.html`):
- Variable font: `opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200`
- Default settings: `FILL 0, wght 400, GRAD 0, opsZ 24`

**Tamaños en uso**:

| Clase Tailwind | Tamaño | Uso |
|----------------|--------|-----|
| `text-[10px]` | 10px | Chevrons de breadcrumb |
| `text-[16px]` | 16px | Quantity controls |
| `text-base` | 20px | Buttons, nav actions |
| `text-sm` | 14px | Inline icons |
| `text-lg` | 18px | Section icons |
| `text-xl` | 24px | Drawer headers |
| `text-2xl` | 28px | Header actions |
| `text-[32px]` | 32px | Large feature icons |
| `text-3xl` | 30px | Pillar card icons |
| `text-4xl` | 36px | Empty/error states |
| `text-5xl` | 40px | Empty states grandes |
| `text-6xl` | 48px | Error page |

**Iconos más utilizados**:
`search`, `shopping_cart`, `favorite`, `favorite_border`, `add_shopping_cart`, `close`, `menu`, `chevron_right`, `chevron_left`, `arrow_forward`, `arrow_outward`, `support_agent`, `chat`, `tune`, `check`, `delete`, `remove`, `add`, `info`, `check_circle`, `error`, `warning`, `cloud_off`, `inventory_2`, `shopping_bag`, `shield`, `local_shipping`, `verified`, `lock`, `forum`, `credit_card`, `account_balance`, `currency_bitcoin`, `receipt_long`, `expand_more`, `category`, `payments`, `factory`, `settings_input_component`, `memory`, `mode_fan`

---

## 8. Animaciones & Motion

### Keyframes (definidos en `styles.css`)

| Keyframe | De → A | Duración |
|----------|--------|----------|
| `fadeInUp` | `opacity:0; translateY(24px)` → `opacity:1; translateY(0)` | 500ms |
| `fadeInScale` | `opacity:0; scale(0.96) translateY(16px)` → `opacity:1; scale(1) translateY(0)` | 600ms |
| `blurIn` | `opacity:0; filter:blur(8px); translateY(16px)` → `opacity:1; filter:blur(0); translateY(0)` | 500ms |
| `slideInLeft` | `translateX(-100%)` → `translateX(0)` | 350ms |
| `slideInRight` | `translateX(100%)` → `translateX(0)` | 350ms |
| `shimmer` | `background-position: -200% 0` → `200% 0` | 1.8s loop |
| `iris-pulse` | `box-shadow: 0 0 0 0 rgba(23,162,184,0.7)` → `0 0 0 6px transparent` | 2s loop |

**Easing**: `cubic-bezier(0.16, 1, 0.3, 1)` —-brand easing para todas las entradas.

### Utility Classes

| Clase | Keyframe | Duración |
|-------|----------|----------|
| `.animate-fade-in-up` | `fadeInUp` | 500ms |
| `.animate-scale-in` | `fadeInScale` | 600ms |
| `.animate-blur-in` | `blurIn` | 500ms |
| `.animate-slide-left` | `slideInLeft` | 350ms |
| `.animate-slide-right` | `slideInRight` | 350ms |

### Stagger Delays

| Clase | Delay |
|-------|-------|
| `.delay-100` | 100ms |
| `.delay-150` | 150ms |
| `.delay-200` | 200ms |
| `.delay-300` | 300ms |
| `.delay-400` | 400ms |
| `.delay-500` | 500ms |

### Transiciones Inline (en Tailwind)

| Uso | Clases |
|-----|--------|
| **Cards hover** | `transition-all hover:border-primary/50` |
| **Buttons hover** | `transition-all hover:brightness-110` |
| **Scale hover** | `transition-transform hover:scale-105` (imágenes) |
| **Color hover** | `transition-colors hover:text-primary` |
| **Border hover** | `transition-colors hover:border-primary` |
| **Image zoom** | `transition-transform duration-500 group-hover:scale-105` |
| **Category bg** | `transition-all duration-700 group-hover:scale-105 group-hover:opacity-80` |

### Scroll Behavior
```css
html { scroll-behavior: smooth; }
```

### Lazy Loading Transition
```css
img[loading="lazy"] {
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
}
```

---

## 9. Efectos Visuales

### Glassmorphism
```html
<!-- Header -->
<header class="bg-surface/80 backdrop-blur-md">
<!-- Toast -->
<div class="backdrop-blur-md">
<!-- Badges overlay -->
<div class="bg-surface/80 backdrop-blur">
```

### Mix-Blend Modes
| Modo | Uso | Componente |
|------|-----|------------|
| `mix-blend-luminosity` | Imágenes de categorías home (efecto B&W) | `home.component.html` |
| `mix-blend-screen` | Imágenes de productos (fondo transparente) | Product cards, cart items |

### Drop Shadows
| Clase | Uso |
|-------|-----|
| `drop-shadow-2xl` | Imágenes de producto, hero product image |
| `shadow-sm` | Header |
| `shadow-md` | Badges de contador, botones |
| `shadow-xl` | Flechas de galería |
| `shadow-2xl` | Cart drawer, toast, modales |

### Glow Effects
```css
.glow-primary { box-shadow: 0 0 15px 0 rgb(63 81 181 / .15); }
.iris-glow-hover:hover { box-shadow: 0 0 15px 0 rgb(63 81 181 / .15); }
```

### Gradient Overlays
```html
<!-- Hero image overlay -->
<div class="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>

<!-- Category card overlay -->
<div class="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/40 to-transparent"></div>

<!-- Section right fade -->
<div class="pointer-events-none absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-primary/10 to-transparent"></div>

<!-- Radial glow -->
<div class="pointer-events-none absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl"></div>
```

### Radial Pattern Background
```html
<div class="pointer-events-none absolute inset-0 opacity-10" style="background-image:radial-gradient(#3F51B5 1px, transparent 1px);background-size:20px 20px"></div>
```

---

## 10. Responsive Behavior

### Header
- **Móvil**: Logo + brand text hidden + hamburger + drawer dropdown
- **Desktop**: Logo + brand visible + 3 nav tabs + action icons
- Brand text: `hidden sm:block`

### Grid de Productos
- Móvil: `grid-cols-2 gap-3`
- Tablet: `sm:grid-cols-2 gap-6`
- Desktop: `lg:grid-cols-3`
- Large: `xl:grid-cols-4`

### Product Detail
- Móvil: Stack vertical (gallery arriba, info abajo)
- Desktop: `lg:grid-cols-2` (gallery izq, info der)

### Cart / Checkout
- Móvil: Stack vertical
- Desktop: `lg:grid-cols-12` (8 col items, 4 col summary)

### Footer
- Móvil: Stack vertical, centrado
- Desktop: `md:flex-row` con espacio-between

### Botones CTA (Hero, About)
- Móvil: `flex-wrap` stack vertical
- Desktop: `md:flex-row` horizontal

---

## 11. Patrones UX

### Feedback Inmediato
- **Add to cart**: Toast success + drawer se abre automáticamente
- **Add to wishlist**: Toast success + badge counter se actualiza
- **Remove**: Toast info + item desaparece
- **Filter apply**: Drawer se cierra + grid se re-renderiza

### Scroll Lock
- Al abrir drawer/modal: `body.style.overflow = 'hidden'`
- Al cerrar: Se restaura valor anterior
- Implementado en `CartService` y `CatalogComponent`

### Carga Infinita
- Inicia con 8 productos
- `loadMore()` agrega 8 más
- Skeleton shimmer durante carga (600ms delay)
- Sin contador visible de total

### Staging de Filtros
- Filtros se modifican en `temp*` signals (no aplican directamente)
- Botón "Aplicar Filtros" confirma cambios
- Botón "Limpiar" resetea staging
- Patrón: `tempFilter → filter`, `tempBrand → selectedBrand`, etc.

### Defer Loading
- Secciones pesadas usan `@defer (on viewport)`
- `@placeholder` muestra skeleton shimmer
- Secciones: Categorías, Novedades, WhatsApp CTA, Métricas, Pilares, CTA About, Ensamble

### Accesibilidad
- `aria-label` en botones de iconos
- `aria-live="polite"` en toast container
- `focus:border-primary focus:outline-none` en inputs
- `cursor-pointer` explícito en elementos clickeables

---

## 12. Convenciones que Deben Respetarse

### Código
1. **Standalone components** — Sin NgModules
2. **Signals** para estado reactivo (`signal`, `computed`)
3. **Lazy loading** en todas las rutas (`loadComponent`)
4. **`inject()`** para dependencias
5. **Servicios** `providedIn: 'root'` con LocalStorage sync
6. **Interfaces** en `core/models/`
7. **CSS Custom Properties** para tokens del design system

### Estilos
1. **Usar tokens del `@theme`** — No hardcodear colores
2. **Utilities globales** en `styles.css` — No duplicar en componentes
3. **Gradiente Iris** solo via `.iris-gradient-*` o `bg-iris-gradient`
4. **Material Symbols** via `<span class="material-symbols-outlined">`
5. **Tailwind v4** — `@theme` directive, no `tailwind.config.js`
6. **Un solo archivo CSS por componente** solo cuando es necesario

### UX
1. **Mobile-first** — Siempre empezar por móvil
2. **Hover states** en todo elemento interactivo
3. **Feedback visual** inmediato en acciones
4. **Scroll lock** en drawers/modales
5. **Lazy loading** en imágenes (`loading="lazy" decoding="async"`)
6. **Skeleton loading** siempre que hay carga async

---

## 13. Anti-Patterns

| Anti-Pattern | Por qué | Alternativa correcta |
|--------------|---------|---------------------|
| Hardcodear `#3f51b5` en templates | Rompe si cambia el token | Usar `text-primary`, `bg-primary`, `border-primary` |
| Usar `font-price-display` para no-precios | Semántica rota | Usar `font-headline-md` o `font-headline-lg` |
| Crear CSS custom en componente para variantes | Duplica esfuerzo | Usar `@apply` en globals o utilities Tailwind |
| Usar `mt-4`/`mb-4` genérico | Inconsistencia visual | Usar tokens semánticos o design tokens |
| Añadir fuentes nuevas sin justificación | Infla bundle, rompe coherencia | Solo Sora, Hanken Grotesk, JetBrains Mono |
| Quitar `mix-blend-screen` de producto | Rompe estética de imagen | Mantener siempre en product images |
| Cambiar el easing `cubic-bezier(0.16, 1, 0.3, 1)` | Rompe sensación de movimiento | Mantener brand easing |
| Usar `ngIf` en lugar de `@if` (Angular 20) | Sintaxis legacy | Usar `@if` / `@for` / `@defer` |
| Selectores CSS con `nth-child` frágiles | Rompen si cambia orden HTML | Usar clases explícitas o Tailwind utilities |
| Imágenes sin `loading="lazy"` | Performance | Siempre incluir `loading="lazy" decoding="async"` |
| Sin `aria-label` en botones de solo icono | Inaccesible | Siempre incluir `aria-label` |
| Toast sin `aria-live"` | Screen readers no lo detectan | `aria-live="polite"` en container |

---

## 14. Reglas para Imágenes & Assets

### Formatos
- **Logo**: JPEG (`/logo/iris.jpeg`) — No SVG
- **Favicon**: ICO (`/logo/iris.ico`)
- **Productos**: JPEG/PNG externos (Google, Unsplash)
- **Categorías**: JPEG externo (Google)

### Patrones de Uso

| Contexto | Clases | Notas |
|----------|--------|-------|
| **Logo header** | `h-10 w-auto rounded-sm` | Alt text obligatorio |
| **Logo footer** | `h-9 w-auto rounded-sm` | Alt text obligatorio |
| **Hero product** | `bg-contain bg-center bg-no-repeat drop-shadow-2xl hover:rotate-0` | Rotación -12° → 0° en hover |
| **Product card** | `h-full w-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105` | `mix-blend-screen` en container |
| **Product detail main** | `h-full w-full object-contain drop-shadow-2xl transition-all duration-300 hover:scale-105` | Aspect-square container |
| **Thumbnail** | `h-full w-full object-contain` | `h-16/w-16 sm:h-20/w-20` |
| **Category card bg** | `bg-cover bg-center opacity-60 mix-blend-luminosity` | Overlay gradient necesario |
| **Cart item** | `h-full w-full object-cover` | `h-24/w-24` o `h-32/w-32` |
| **Checkout item** | `h-8 w-8 object-contain rounded bg-surface p-0.5` | Miniatura |

### Directrices
1. **Siempre** `loading="lazy" decoding="async"` en imágenes no-criticas
2. **Siempre** `alt` text descriptivo
3. **Usar** `object-contain` para productos (fondo transparente)
4. **Usar** `object-cover` para fotos lifestyle
5. **No** usar `bg-blend-*` sin un overlay gradient
6. **Control de calidad**: Sin directivas de tamaño en URLs externas (mejorar en futuro)

---

## 15. Data Models (Referencia)

### Product
```typescript
interface Product {
  id: string;           // slug único (ej: "rtx-4090")
  name: string;         // nombre completo del producto
  category: string;     // "GPU" | "CPU" | "PERIPHERAL" | "MEMORY" | "DISPLAYS" | "SYSTEMS"
  brand?: string;       // "ASUS" | "AMD" | "NVIDIA" | etc.
  subtitle: string;     // tag corto (ej: "NVIDIA / 24GB GDDR6X")
  price: number;        // precio actual
  originalPrice?: number; // precio tachado (opcional)
  image: string;        // URL imagen principal
  images?: string[];    // URLs galería (opcional)
  description: string;  // descripción larga
  inStock?: boolean;    // default true
  specs?: string[];     // ["RTX 40 Series", "16GB+ VRAM", "PCIe 5.0"]
  badge?: string;       // "Oferta" | "Nuevo" | "En Stock" | "Popular" | etc.
  isFeatured?: boolean; // para home page
}
```

### Category
```typescript
interface Category {
  id: string;   // "GPU" | "CPU" | etc.
  name: string; // "Tarjetas Gráficas"
  slug: string; // "gpu" | "cpu" | etc.
}
```

### HomeCategory
```typescript
interface HomeCategory {
  id: string;     // "furniture" | "peripherals" | etc.
  name: string;   // "Mobiliario Ergonómico"
  tag: string;    // "Centros de Mando"
  image: string;  // URL de imagen
}
```

### Categorías Disponibles
| ID | Nombre | Slug |
|----|--------|------|
| ALL | Todo el Hardware | all |
| GPU | Tarjetas Gráficas | gpu |
| CPU | Procesadores | cpu |
| PERIPHERAL | Periféricos | peripheral |
| MEMORY | Memoria & Almacenamiento | memory |
| DISPLAYS | Monitores & Pantallas | displays |
| SYSTEMS | Workstations & Sistemas | systems |

---

## 16. Archivos de Referencia

| Archivo | Contenido |
|---------|-----------|
| `src/styles.css` | Design tokens (`@theme`), utilities globales, keyframes, `.product-card`, `.skeleton`, `.input-tech`, `.custom-checkbox` |
| `src/index.html` | Google Fonts (Sora, Hanken Grotesk, JetBrains Mono), Material Symbols |
| `src/app/shared/header.component.css` | `.header-tab`, `.mobile-nav-link`, `.header-action`, `.header-link` |
| `src/app/features/home/home.component.css` | Overrides de grid de categorías, responsive overrides |
| `src/app/core/models/product.ts` | Interfaces TypeScript |
| `src/app/app.routes.ts` | Rutas lazy-loaded |
| `src/app/app.html` | Shell: header + router-outlet + footer + cart-drawer + toast |
| `db.json` | Datos mock de productos, categorías, homeCategories |

---

*Este documento es el contrato visual del proyecto. Cualquier trabajo de ampliación debe respetar estos patrones, tokens y convenciones para mantener la identidad visual de Iris Computer.*

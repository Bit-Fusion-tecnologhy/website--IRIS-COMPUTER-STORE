import { Routes } from '@angular/router';
import { SeoMetadata } from './core/services/seo.service';

const SITE_URL = 'https://iriscoputer.com'; // Update with actual domain

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'Iris Computer | Ingeniería de Precisión en Hardware',
    data: {
      seo: {
        title: 'Iris Computer | Ingeniería de Precisión en Hardware',
        description: 'Iris Computer — Hardware de ingeniería de precisión. Computadoras, laptops, componentes y periféricos de alto rendimiento para profesionales y gamers en Bolivia.',
        canonical: SITE_URL,
        robots: 'index, follow',
        ogTitle: 'Iris Computer | Ingeniería de Precisión en Hardware',
        ogDescription: 'Computadoras, laptops, componentes y periféricos de alto rendimiento para profesionales y gamers en Bolivia.',
        ogImage: `${SITE_URL}/logo/iris.jpeg`,
        ogType: 'website',
      } as SeoMetadata
    }
  },
  {
    path: 'catalog',
    loadComponent: () => import('./features/catalog/catalog.component').then(m => m.CatalogComponent),
    title: 'Catálogo de Productos | Iris Computer',
    data: {
      seo: {
        title: 'Catálogo de Productos | Iris Computer',
        description: 'Explora nuestro catálogo de hardware de precisión: tarjetas gráficas, procesadores, periféricos, monitores y workstations de las mejores marcas.',
        canonical: `${SITE_URL}/catalog`,
        robots: 'index, follow',
        ogTitle: 'Catálogo de Productos | Iris Computer',
        ogDescription: 'Hardware de precisión: tarjetas gráficas, procesadores, periféricos y workstations.',
        ogImage: `${SITE_URL}/logo/iris.jpeg`,
        ogType: 'website',
      } as SeoMetadata
    }
  },
  {
    path: 'emprendedores',
    loadComponent: () => import('./features/entrepreneurs/entrepreneurs.component').then(m => m.EntrepreneursComponent),
    title: 'Emprendedores | Iris Computer',
    data: {
      seo: {
        title: 'Emprendedores | Iris Computer',
        description: 'Conoce las historias de emprendedores, estudiantes y creadores que confían en Iris Computer para impulsar sus proyectos con tecnología de precisión.',
        canonical: `${SITE_URL}/emprendedores`,
        robots: 'index, follow',
        ogTitle: 'Emprendedores | Iris Computer',
        ogDescription: 'Historias de emprendedores y creadores que confían en Iris Computer.',
        ogImage: `${SITE_URL}/logo/iris.jpeg`,
        ogType: 'website',
      } as SeoMetadata
    }
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent),
    title: 'Acerca de Nosotros | Iris Computer',
    data: {
      seo: {
        title: 'Acerca de Nosotros | Iris Computer',
        description: 'Iris Computer — Ingeniería de precisión para hardware de alto rendimiento. Más de 10,000 sistemas ensamblados, garantía de 3 años y soporte por ingenieros.',
        canonical: `${SITE_URL}/about`,
        robots: 'index, follow',
        ogTitle: 'Acerca de Nosotros | Iris Computer',
        ogDescription: 'Ingeniería de precisión para hardware de alto rendimiento. +10,000 sistemas ensamblados.',
        ogImage: `${SITE_URL}/logo/iris.jpeg`,
        ogType: 'website',
      } as SeoMetadata
    }
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./features/product/product.component').then(m => m.ProductComponent),
    title: 'Producto | Iris Computer',
    data: {
      seo: {
        title: 'Producto | Iris Computer',
        description: 'Consulta las especificaciones, precio y disponibilidad de este producto de Iris Computer.',
        robots: 'index, follow',
        ogType: 'product',
      } as SeoMetadata
    }
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent),
    title: 'Carrito de Compras | Iris Computer',
    data: {
      seo: {
        title: 'Carrito de Compras | Iris Computer',
        description: 'Revisa los productos en tu carrito de compras de Iris Computer.',
        robots: 'noindex, nofollow',
        ogType: 'website',
      } as SeoMetadata
    }
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./features/wishlist/wishlist.component').then(m => m.WishlistComponent),
    title: 'Favoritos | Iris Computer',
    data: {
      seo: {
        title: 'Favoritos | Iris Computer',
        description: 'Tus productos favoritos en Iris Computer.',
        robots: 'noindex, nofollow',
        ogType: 'website',
      } as SeoMetadata
    }
  },
  {
    path: 'cart-preview',
    redirectTo: 'cart',
    pathMatch: 'full'
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/pages/pages.component').then(m => m.PagesComponent),
    title: 'Finalizar Compra | Iris Computer',
    data: {
      mode: 'checkout',
      seo: {
        title: 'Finalizar Compra | Iris Computer',
        description: 'Completa tu pedido en Iris Computer.',
        robots: 'noindex, nofollow',
        ogType: 'website',
      } as SeoMetadata
    }
  },
  {
    path: 'contact',
    redirectTo: 'about',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent),
    canActivate: [() => import('./core/guards/auth.guard').then(m => m.guestGuard)],
    title: 'Acceso | Iris Computer',
    data: {
      seo: {
        title: 'Acceso | Iris Computer',
        description: 'Inicia sesión o crea tu cuenta en Iris Computer.',
        robots: 'noindex, nofollow',
        ogType: 'website',
      } as SeoMetadata
    }
  },
  {
    path: 'login',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'register',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'account',
    loadComponent: () => import('./features/account/account.component').then(m => m.AccountComponent),
    canActivate: [() => import('./core/guards/auth.guard').then(m => m.authGuard)],
    title: 'Mi Cuenta | Iris Computer',
    data: {
      seo: {
        title: 'Mi Cuenta | Iris Computer',
        description: 'Gestiona tu perfil y revisa tus pedidos en Iris Computer.',
        robots: 'noindex, nofollow',
        ogType: 'website',
      } as SeoMetadata
    }
  },
  {
    path: 'profile',
    redirectTo: 'account',
    pathMatch: 'full'
  },
  {
    path: 'mis-compras',
    redirectTo: 'account',
    pathMatch: 'full'
  },
  {
    path: 'orders',
    redirectTo: 'account',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: ''
  },
];

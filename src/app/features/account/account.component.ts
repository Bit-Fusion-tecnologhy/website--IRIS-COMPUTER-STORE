import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Order, OrderService } from '../../core/services/order.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly auth = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  readonly user = this.auth.currentUser;
  readonly orders = signal<Order[]>([]);
  readonly isLoadingOrders = signal(true);
  readonly selectedTab = signal<'orders' | 'profile'>('orders');

  // Estado para expandir/colapsar órdenes individuales
  readonly expandedOrderIds = signal<Set<string>>(new Set<string>());

  // Estado de edición de perfil
  readonly isSavingProfile = signal(false);

  readonly boliviaDepartments: string[] = [
    'Beni',
    'Chuquisaca',
    'Cochabamba',
    'La Paz',
    'Oruro',
    'Pando',
    'Potosí',
    'Santa Cruz',
    'Tarija',
  ];

  readonly profileForm = this.fb.nonNullable.group({
    phone: ['', [Validators.required, Validators.minLength(7)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    city: ['', [Validators.required]],
    zipCode: [''],
  });

  isFieldInvalid(field: string): boolean {
    const control = this.profileForm.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  getProfileError(field: string): string | null {
    const control = this.profileForm.get(field);
    if (!control || !control.errors || (!control.touched && !control.dirty)) return null;

    if (control.hasError('required')) {
      if (field === 'phone') return 'El teléfono de contacto es obligatorio';
      if (field === 'address') return 'La dirección de entrega es obligatoria';
      if (field === 'city') return 'Selecciona un departamento de Bolivia';
      return 'Este campo es obligatorio';
    }
    if (control.hasError('minlength')) {
      if (field === 'phone') return 'Ingresa un número de teléfono válido (mínimo 7 dígitos)';
      if (field === 'address') return 'Ingresa una dirección detallada';
    }
    return null;
  }

  ngOnInit(): void {
    const currentUser = this.user();
    if (!currentUser) {
      this.router.navigate(['/auth']);
      return;
    }

    // Inicializar campos de edición
    this.profileForm.patchValue({
      phone: currentUser.phone || '',
      address: currentUser.address || '',
      city: currentUser.city || '',
      zipCode: currentUser.zipCode || '',
    });

    this.loadUserOrders(currentUser.id);
  }

  loadUserOrders(userId: string): void {
    this.isLoadingOrders.set(true);
    this.orderService.getUserOrders(userId).subscribe({
      next: (data) => {
        // Ordenar por fecha descendente
        const sorted = (data || []).sort((a, b) => {
          const timeA = new Date(a.createdAt).getTime();
          const timeB = new Date(b.createdAt).getTime();
          return timeB - timeA;
        });

        this.orders.set(sorted);
        // Expandir por defecto la primera orden si existe
        if (sorted.length > 0 && sorted[0].id) {
          this.expandedOrderIds.set(new Set([sorted[0].id]));
        }
        this.isLoadingOrders.set(false);
      },
      error: (err) => {
        console.error('Error al cargar órdenes del usuario:', err);
        this.orders.set([]);
        this.isLoadingOrders.set(false);
      },
    });
  }

  toggleOrderExpand(orderId?: string): void {
    if (!orderId) return;
    const current = new Set(this.expandedOrderIds());
    if (current.has(orderId)) {
      current.delete(orderId);
    } else {
      current.add(orderId);
    }
    this.expandedOrderIds.set(current);
  }

  isOrderExpanded(orderId?: string): boolean {
    return !!orderId && this.expandedOrderIds().has(orderId);
  }

  saveProfileChanges(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.toastService.error('Revisa los campos marcados en rojo.');
      return;
    }

    this.isSavingProfile.set(true);
    this.auth
      .updateProfile(this.profileForm.getRawValue())
      .subscribe({
        next: () => {
          this.isSavingProfile.set(false);
          this.toastService.success('Datos de envío actualizados.');
        },
        error: () => {
          this.isSavingProfile.set(false);
          this.toastService.error('Error al actualizar el perfil.');
        },
      });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'shipped':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'processing':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'confirmed':
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'shipped':
        return 'Enviado';
      case 'processing':
        return 'En Preparación';
      case 'confirmed':
      default:
        return 'Confirmada';
    }
  }

  getDeliveryLabel(order: Order): string {
    if (order.modalidadEnvio) return order.modalidadEnvio;
    if (order.shippingMethod) return order.shippingMethod;
    return order.delivery === 'express' ? 'Express 24 Horas' : 'Courier Prioritario (2-3 Días)';
  }

  getDeliveryIcon(order: Order): string {
    return order.delivery === 'express' ? 'flight_takeoff' : 'local_shipping';
  }

  logout(): void {
    this.auth.logout(true);
  }
}

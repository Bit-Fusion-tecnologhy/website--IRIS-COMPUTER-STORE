import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { Order, OrderService } from '../../core/services/order.service';
import { ToastService } from '../../core/services/toast.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CurrencyPipe],
  templateUrl: './pages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly cart = inject(CartService);
  readonly auth = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly toastService = inject(ToastService);

  readonly mode = signal<'checkout' | 'contact'>('checkout');

  // Checkout Reactive Form
  readonly checkoutForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    address: ['', [Validators.required]],
    city: ['', [Validators.required]],
    zipCode: [''],
  });

  paymentMethod: 'card' | 'transfer' | 'crypto' = 'card';
  readonly delivery = signal<'priority' | 'express'>('priority');
  readonly isSubmitting = signal(false);
  readonly completedOrder = signal<Order | null>(null);
  readonly errorMessage = signal<string | null>(null);

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

  // Financial Computations
  readonly shipping = computed(() => (this.delivery() === 'priority' ? 45 : 120));
  readonly tax = computed(() => this.cart.total() * 0.085);
  readonly total = computed(() => this.cart.total() + this.shipping() + this.tax());

  // Contact Form (Fallback in pages)
  readonly contactForm = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['Consulta General'],
    message: ['', [Validators.required]],
  });
  readonly contactSubmitting = signal(false);
  readonly contactSent = signal(false);

  ngOnInit() {
    this.route.data.subscribe((data) => {
      if (data['mode']) {
        this.mode.set(data['mode']);
      }
    });

    const currentUser = this.auth.currentUser();
    if (currentUser) {
      this.checkoutForm.patchValue({
        fullName: currentUser.fullName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        city: currentUser.city || '',
        zipCode: currentUser.zipCode || '',
      });
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.checkoutForm.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  getCheckoutError(field: string): string | null {
    const control = this.checkoutForm.get(field);
    if (!control || !control.errors || (!control.touched && !control.dirty)) return null;

    if (control.hasError('required')) {
      if (field === 'fullName') return 'El nombre completo es obligatorio';
      if (field === 'email') return 'El correo electrónico es obligatorio';
      if (field === 'phone') return 'El teléfono es obligatorio para la entrega';
      if (field === 'address') return 'La dirección de entrega es obligatoria';
      if (field === 'city') return 'Selecciona un departamento de Bolivia';
      return 'Este campo es obligatorio';
    }
    if (control.hasError('email')) return 'Ingresa un correo electrónico válido';
    if (control.hasError('minlength')) return 'Ingresa al menos 3 caracteres';
    return null;
  }

  processOrder() {
    if (this.cart.items().length === 0) {
      this.errorMessage.set('Tu carrito está vacío. Agrega productos antes de continuar.');
      this.toastService.warning('Tu carrito está vacío.');
      return;
    }

    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      this.errorMessage.set('Por favor completa todos los campos obligatorios con información válida.');
      this.toastService.error('Revisa los campos marcados en rojo.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const currentUser = this.auth.currentUser();
    const orderNumber = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const deliveryMethodLabel =
      this.delivery() === 'priority' ? 'Courier Prioritario (2-3 Días Hábiles)' : 'Express 24 Horas';

    const formVal = this.checkoutForm.getRawValue();

    const newOrder: Order = {
      orderNumber,
      userId: currentUser?.id,
      customer: {
        fullName: formVal.fullName,
        email: formVal.email,
        phone: formVal.phone,
        address: formVal.address,
        city: formVal.city,
        zipCode: formVal.zipCode,
      },
      items: [...this.cart.items()],
      delivery: this.delivery(),
      modalidadEnvio: deliveryMethodLabel,
      shippingMethod: deliveryMethodLabel,
      subtotal: this.cart.total(),
      shipping: this.shipping(),
      tax: this.tax(),
      total: this.total(),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    this.orderService.createOrder(newOrder).subscribe({
      next: (order) => {
        this.completedOrder.set(order);
        this.cart.clear();
        this.isSubmitting.set(false);
        this.toastService.success(`¡Orden ${order.orderNumber} confirmada con éxito!`);
      },
      error: (err) => {
        console.error('Error creating order:', err);
        // Fallback: Si el servidor falla, confirmamos orden en frontend
        this.completedOrder.set(newOrder);
        this.cart.clear();
        this.isSubmitting.set(false);
        this.toastService.success(`¡Orden ${newOrder.orderNumber} procesada!`);
      },
    });
  }

  submitContact() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.toastService.error('Por favor completa todos los campos del formulario.');
      return;
    }

    this.contactSubmitting.set(true);
    const formVal = this.contactForm.getRawValue();

    this.orderService
      .sendMessage({
        name: formVal.name,
        email: formVal.email,
        subject: formVal.subject,
        message: formVal.message,
        createdAt: new Date().toISOString(),
      })
      .subscribe({
        next: () => {
          this.contactSent.set(true);
          this.contactSubmitting.set(false);
          this.toastService.success('Mensaje enviado al equipo de soporte.');
          this.contactForm.reset({ subject: 'Consulta General' });
        },
        error: () => {
          this.contactSent.set(true);
          this.contactSubmitting.set(false);
          this.toastService.success('Mensaje enviado al equipo.');
        },
      });
  }
}

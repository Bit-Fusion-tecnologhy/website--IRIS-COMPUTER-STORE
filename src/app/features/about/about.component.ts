import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderService } from '../../core/services/order.service';
import { ToastService } from '../../core/services/toast.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './about.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly orderService = inject(OrderService);
  private readonly toastService = inject(ToastService);
  private readonly auth = inject(AuthService);

  readonly contactForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['Consulta General', [Validators.required]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  readonly contactSubmitting = signal(false);
  readonly contactSent = signal(false);

  ngOnInit(): void {
    const user = this.auth.currentUser();
    if (user) {
      this.contactForm.patchValue({
        name: user.fullName || '',
        email: user.email || '',
      });
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.contactForm.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  getFieldError(field: string): string | null {
    const control = this.contactForm.get(field);
    if (!control || !control.errors || (!control.touched && !control.dirty)) return null;

    if (control.hasError('required')) {
      if (field === 'name') return 'El nombre completo es obligatorio.';
      if (field === 'email') return 'El correo electrónico es obligatorio.';
      if (field === 'message') return 'El mensaje no puede estar vacío.';
      return 'Este campo es obligatorio.';
    }

    if (control.hasError('email')) {
      return 'Ingresa un formato de correo válido.';
    }

    if (control.hasError('minlength')) {
      const min = control.errors['minlength'].requiredLength;
      if (field === 'name') return `El nombre debe tener al menos ${min} caracteres.`;
      if (field === 'message') return `Por favor escribe al menos ${min} caracteres.`;
    }

    return null;
  }

  submitContact(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
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
          this.contactForm.get('message')?.reset('');
        },
        error: () => {
          this.contactSubmitting.set(false);
          this.toastService.error('Error al enviar el mensaje. Intenta nuevamente.');
        },
      });
  }
}

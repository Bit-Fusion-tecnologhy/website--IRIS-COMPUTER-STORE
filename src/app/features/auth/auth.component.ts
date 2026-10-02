import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  if (confirmPassword && password !== confirmPassword) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './auth.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toastService = inject(ToastService);

  readonly activeTab = signal<'login' | 'register'>('login');
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  // Toggle visual para contraseñas
  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);

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

  // Formularios Reactivos
  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  readonly registerForm = this.fb.nonNullable.group(
    {
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      phone: [''],
      address: [''],
      city: [''],
      zipCode: [''],
    },
    { validators: passwordMatchValidator }
  );

  private returnUrl = '/account';

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/account']);
      return;
    }

    this.route.queryParams.subscribe((params) => {
      if (params['mode'] === 'register') {
        this.activeTab.set('register');
      } else {
        this.activeTab.set('login');
      }

      if (params['returnUrl'] && params['returnUrl'] !== '/') {
        this.returnUrl = params['returnUrl'];
      } else {
        this.returnUrl = '/account';
      }
    });
  }

  setTab(tab: 'login' | 'register'): void {
    this.activeTab.set(tab);
    this.errorMessage.set(null);
    this.loginForm.reset();
    this.registerForm.reset();
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((val) => !val);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update((val) => !val);
  }

  fillDemoUser(): void {
    this.loginForm.setValue({
      email: 'alex.gamer@iris.com',
      password: 'iris2026',
    });
    this.loginForm.markAsUntouched();
    this.errorMessage.set(null);
    this.toastService.info('Credenciales de prueba cargadas.');
  }

  isFieldInvalid(form: 'login' | 'register', field: string): boolean {
    if (form === 'login') {
      const control = this.loginForm.get(field);
      return !!control && control.invalid && (control.touched || control.dirty);
    }
    if (
      field === 'confirmPassword' &&
      this.registerForm.hasError('passwordMismatch') &&
      (this.registerForm.get('confirmPassword')?.touched || this.registerForm.get('confirmPassword')?.dirty)
    ) {
      return true;
    }
    const control = this.registerForm.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  getFieldError(form: 'login' | 'register', field: string): string | null {
    const control = form === 'login' ? this.loginForm.get(field) : this.registerForm.get(field);

    if (form === 'register' && field === 'confirmPassword') {
      if (control?.hasError('required') && (control.touched || control.dirty)) {
        return 'Por favor confirma tu contraseña.';
      }
      if (this.registerForm.hasError('passwordMismatch') && (control?.touched || control?.dirty)) {
        return 'Las contraseñas no coinciden.';
      }
    }

    if (!control || !control.errors || (!control.touched && !control.dirty)) {
      return null;
    }

    if (control.hasError('required')) {
      if (field === 'fullName') return 'El nombre completo es obligatorio.';
      if (field === 'email') return 'El correo electrónico es obligatorio.';
      if (field === 'password') return 'La contraseña es obligatoria.';
      return 'Este campo es obligatorio.';
    }

    if (control.hasError('email')) {
      return 'Ingresa un correo electrónico válido.';
    }

    if (control.hasError('minlength')) {
      const min = control.errors['minlength'].requiredLength;
      if (field === 'fullName') return `El nombre debe tener al menos ${min} caracteres.`;
      if (field === 'password') return `La contraseña debe tener al menos ${min} caracteres.`;
    }

    return null;
  }

  submitLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.message || 'Error al iniciar sesión');
      },
    });
  }

  submitRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const { confirmPassword: _, ...registerData } = this.registerForm.getRawValue();

    this.authService.register(registerData).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.message || 'Error al registrar la cuenta');
      },
    });
  }
}

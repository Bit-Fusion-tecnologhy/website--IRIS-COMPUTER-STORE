import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, switchMap, throwError } from 'rxjs';
import { LoginCredentials, RegisterData, User } from '../models/user';
import { ToastService } from './toast.service';
import { environment } from '../../../environments/environment';

const AUTH_STORAGE_KEY = 'iris_auth_user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly apiUrl = environment.apiUrl;

  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly userFullName = computed(() => this.currentUser()?.fullName || '');
  readonly userEmail = computed(() => this.currentUser()?.email || '');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.restoreSession();
    }
  }

  /**
   * Restaura la sesión guardada en LocalStorage al iniciar
   */
  private restoreSession(): void {
    try {
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedUser) {
        const parsed: User = JSON.parse(savedUser);
        if (parsed && parsed.id && parsed.email) {
          this.currentUser.set(parsed);
        }
      }
    } catch (e) {
      console.error('Error al restaurar sesión de usuario:', e);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  /**
   * Inicia sesión validando contra json-server /users
   */
  login(credentials: LoginCredentials): Observable<User> {
    const cleanEmail = credentials.email.trim().toLowerCase();

    return this.http.get<User[]>(`${this.apiUrl}/users?email=${encodeURIComponent(cleanEmail)}`).pipe(
      switchMap((users) => {
        if (!users || users.length === 0) {
          return throwError(() => new Error('No existe una cuenta registrada con este correo electrónico.'));
        }

        const user = users[0];
        if (user.password !== credentials.password) {
          return throwError(() => new Error('Contraseña incorrecta. Por favor verifica tus credenciales.'));
        }

        // Crear objeto de sesión sin exponer el password
        const safeUser: User = {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone || '',
          address: user.address || '',
          city: user.city || '',
          zipCode: user.zipCode || '',
          role: user.role || 'customer',
          avatar: user.avatar,
          createdAt: user.createdAt,
        };

        this.setSession(safeUser);
        this.toastService.success(`¡Bienvenido de nuevo, ${safeUser.fullName}!`);
        return [safeUser];
      }),
      catchError((error) => {
        const msg = error?.message || 'Error al iniciar sesión. Inténtalo nuevamente.';
        this.toastService.error(msg);
        return throwError(() => new Error(msg));
      })
    );
  }

  /**
   * Registra un nuevo usuario en json-server
   */
  register(data: RegisterData): Observable<User> {
    const cleanEmail = data.email.trim().toLowerCase();

    // 1. Validar que el email no esté en uso
    return this.http.get<User[]>(`${this.apiUrl}/users?email=${encodeURIComponent(cleanEmail)}`).pipe(
      switchMap((existingUsers) => {
        if (existingUsers && existingUsers.length > 0) {
          return throwError(() => new Error('Ya existe una cuenta registrada con este correo electrónico.'));
        }

        const newUser: User = {
          id: 'usr-' + Math.random().toString(36).substring(2, 9),
          fullName: data.fullName.trim(),
          email: cleanEmail,
          password: data.password,
          phone: data.phone?.trim() || '',
          address: data.address?.trim() || '',
          city: data.city?.trim() || '',
          zipCode: data.zipCode?.trim() || '',
          role: 'customer',
          createdAt: new Date().toISOString(),
        };

        return this.http.post<User>(`${this.apiUrl}/users`, newUser).pipe(
          map((createdUser) => {
            const safeUser: User = { ...createdUser };
            delete safeUser.password;
            this.setSession(safeUser);
            this.toastService.success(`¡Registro exitoso! Bienvenido a Iris Computer, ${safeUser.fullName}`);
            return safeUser;
          })
        );
      }),
      catchError((error) => {
        const msg = error?.message || 'Error al crear la cuenta. Inténtalo nuevamente.';
        this.toastService.error(msg);
        return throwError(() => new Error(msg));
      })
    );
  }

  /**
   * Actualiza el perfil del usuario activo en json-server
   */
  updateProfile(updates: Partial<User>): Observable<User> {
    const current = this.currentUser();
    if (!current) {
      return throwError(() => new Error('No hay sesión activa'));
    }

    return this.http.patch<User>(`${this.apiUrl}/users/${current.id}`, updates).pipe(
      map((updated) => {
        const safeUser: User = { ...updated };
        delete safeUser.password;
        this.setSession(safeUser);
        this.toastService.success('Perfil actualizado correctamente.');
        return safeUser;
      }),
      catchError((error) => {
        this.toastService.error('Error al actualizar el perfil.');
        return throwError(() => error);
      })
    );
  }

  /**
   * Cierra la sesión activa
   */
  logout(redirectToHome = true): void {
    this.currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    this.toastService.info('Sesión finalizada. ¡Hasta pronto!');
    if (redirectToHome) {
      this.router.navigate(['/']);
    }
  }

  /**
   * Almacena el usuario en Signal y LocalStorage
   */
  private setSession(user: User): void {
    this.currentUser.set(user);
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } catch (e) {
        console.error('Error al persistir sesión en LocalStorage:', e);
      }
    }
  }
}

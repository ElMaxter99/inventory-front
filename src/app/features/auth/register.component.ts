import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule
  ],
  template: `
    <div class="auth-wrapper">
      <mat-card>
        <mat-card-title>Crea tu cuenta</mat-card-title>
        <mat-card-subtitle>Configura tu hogar en minutos</mat-card-subtitle>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="name" autocomplete="name" />
              <mat-error *ngIf="form.controls.name.invalid">Nombre requerido</mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" autocomplete="email" />
              <mat-error *ngIf="form.controls.email.invalid">Email válido requerido</mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Contraseña</mat-label>
              <input matInput formControlName="password" type="password" autocomplete="new-password" />
              <mat-error *ngIf="form.controls.password.invalid">Mínimo 6 caracteres</mat-error>
            </mat-form-field>
            <button mat-flat-button color="primary" type="submit" [disabled]="loading">
              Crear cuenta
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <a routerLink="/auth/login">¿Ya tienes cuenta? Inicia sesión</a>
        </mat-card-actions>
      </mat-card>
      <mat-progress-bar *ngIf="loading" mode="indeterminate"></mat-progress-bar>
    </div>
  `,
  styles: [
    `
      .auth-wrapper {
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: var(--app-gradient);
        padding: 1.5rem;
      }

      mat-card {
        width: min(420px, 100%);
        padding: 1.5rem;
      }

      form {
        display: grid;
        gap: 1rem;
      }
    `
  ]
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly notificationService = inject(NotificationService);

  loading = false;

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.authService.register(this.form.getRawValue()).subscribe({
      next: () => {
        this.notificationService.show('Registro exitoso. Inicia sesión para continuar.');
        this.router.navigate(['/auth/login']);
      },
      error: () => (this.loading = false),
      complete: () => (this.loading = false)
    });
  }
}

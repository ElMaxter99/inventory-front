import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatProgressBarModule
  ],
  template: `
    <div class="auth-wrapper">
      <mat-card>
        <mat-card-title>Inicia sesión</mat-card-title>
        <mat-card-subtitle>Accede a tu inventario doméstico</mat-card-subtitle>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" autocomplete="email" />
              <mat-error *ngIf="form.controls.email.invalid">Email válido requerido</mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Contraseña</mat-label>
              <input matInput formControlName="password" type="password" autocomplete="current-password" />
              <mat-error *ngIf="form.controls.password.invalid">Mínimo 6 caracteres</mat-error>
            </mat-form-field>
            <mat-checkbox formControlName="remember">Recordarme</mat-checkbox>
            <button mat-flat-button color="primary" type="submit" [disabled]="loading">
              Entrar
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <a routerLink="/auth/register">¿No tienes cuenta? Regístrate</a>
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
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  loading = false;

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [false]
  });

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const { email, password } = this.form.getRawValue();
    this.authService.login({ email, password }).subscribe({
      next: () => this.router.navigate(['/app/inventories']),
      error: () => (this.loading = false),
      complete: () => (this.loading = false)
    });
  }
}

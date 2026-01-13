import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-screen">
      <header class="top-bar">
        <button class="icon-button" type="button">
          <span class="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2>Sign Up</h2>
      </header>

      <main class="auth-card">
        <h1>Create Your Account</h1>
        <p class="subtitle">
          Join your household and start managing your inventory smarter with AI suggestions.
        </p>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="auth-form">
          <label class="field">
            <span>Full Name</span>
            <input type="text" formControlName="name" autocomplete="name" placeholder="Enter your full name" />
          </label>

          <label class="field">
            <span>Email Address</span>
            <input
              type="email"
              formControlName="email"
              autocomplete="email"
              placeholder="email@example.com"
            />
          </label>

          <label class="field">
            <span>Password</span>
            <div class="password-field">
              <input
                [type]="showPassword ? 'text' : 'password'"
                formControlName="password"
                autocomplete="new-password"
                placeholder="Create a strong password"
              />
              <button class="icon-button" type="button" (click)="togglePassword()">
                <span class="material-symbols-outlined">visibility</span>
              </button>
            </div>
          </label>

          <div class="password-hints">
            <div class="hint active">
              <span class="material-symbols-outlined">check_circle</span>
              8+ characters
            </div>
            <div class="hint">
              <span class="material-symbols-outlined">radio_button_unchecked</span>
              One number
            </div>
            <div class="hint">
              <span class="material-symbols-outlined">radio_button_unchecked</span>
              One special char
            </div>
            <div class="hint">
              <span class="material-symbols-outlined">radio_button_unchecked</span>
              Upper & lower case
            </div>
          </div>

          <label class="field">
            <span>Confirm Password</span>
            <input
              type="password"
              formControlName="confirmPassword"
              autocomplete="new-password"
              placeholder="Repeat your password"
            />
          </label>

          <button class="primary-button" type="submit" [disabled]="loading">
            Create Account
          </button>
        </form>

        <p class="terms">
          By creating an account, you agree to our
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </p>

        <div class="footer-link">
          <p>
            Already have an account?
            <a routerLink="/auth/login">Log In</a>
          </p>
        </div>
      </main>

      <div class="brand-art">
        <svg fill="none" viewBox="0 0 200 200" aria-hidden="true">
          <circle cx="100" cy="100" r="80" stroke="#13ecc8" stroke-dasharray="10 5" stroke-width="2" />
          <rect x="70" y="70" width="60" height="60" rx="10" stroke="#13ecc8" stroke-width="2" />
          <path d="M100 70V130M70 100H130" stroke="#13ecc8" stroke-width="2" />
        </svg>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background: #10221f;
        color: #fff;
      }

      .auth-screen {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        padding: 0 24px 40px;
        position: relative;
        overflow: hidden;
      }

      .top-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 0 12px;
      }

      .top-bar h2 {
        flex: 1;
        text-align: center;
        font-size: 18px;
        font-weight: 700;
        margin: 0;
      }

      .icon-button {
        width: 40px;
        height: 40px;
        border-radius: 999px;
        border: none;
        background: rgba(255, 255, 255, 0.06);
        color: #fff;
        display: grid;
        place-items: center;
        cursor: pointer;
      }

      .auth-card {
        max-width: 440px;
        width: 100%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding-top: 24px;
      }

      h1 {
        font-size: 32px;
        margin: 0;
      }

      .subtitle {
        color: #9db9b4;
        margin: 0 0 8px;
      }

      .auth-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .field span {
        display: block;
        font-size: 14px;
        margin-bottom: 8px;
      }

      .field input {
        width: 100%;
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.05);
        color: #fff;
        padding: 14px 16px;
        font-size: 16px;
      }

      .password-field {
        display: flex;
        align-items: center;
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.05);
        overflow: hidden;
      }

      .password-field input {
        border: none;
        background: transparent;
        flex: 1;
      }

      .password-hints {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
        font-size: 12px;
        color: #9db9b4;
      }

      .hint {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .hint.active {
        color: #13ecc8;
      }

      .hint span {
        font-size: 14px;
      }

      .primary-button {
        height: 56px;
        border-radius: 16px;
        border: none;
        background: #13ecc8;
        color: #10221f;
        font-size: 18px;
        font-weight: 700;
        box-shadow: 0 12px 24px rgba(19, 236, 200, 0.2);
        cursor: pointer;
      }

      .terms {
        font-size: 11px;
        color: #9db9b4;
        text-align: center;
      }

      .terms a {
        color: #13ecc8;
        text-decoration: underline;
      }

      .footer-link {
        text-align: center;
        color: #9db9b4;
      }

      .footer-link a {
        color: #13ecc8;
        font-weight: 600;
      }

      .brand-art {
        position: absolute;
        right: -40px;
        bottom: 0;
        opacity: 0.08;
        width: 200px;
        height: 200px;
        pointer-events: none;
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
  showPassword = false;

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const { name, email, password } = this.form.getRawValue();
    this.authService.register({ name, email, password }).subscribe({
      next: () => {
        this.notificationService.show('Registro exitoso. Inicia sesión para continuar.');
        this.router.navigate(['/auth/login']);
      },
      error: () => (this.loading = false),
      complete: () => (this.loading = false)
    });
  }
}

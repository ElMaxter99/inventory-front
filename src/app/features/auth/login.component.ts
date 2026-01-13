import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-screen">
      <header class="top-bar">
        <button class="icon-button" type="button">
          <span class="material-symbols-outlined">arrow_back_ios</span>
        </button>
        <h2>Login</h2>
      </header>

      <main class="auth-card">
        <div class="logo">
          <span class="material-symbols-outlined">inventory_2</span>
        </div>
        <h1>Login to Your Home</h1>
        <p class="subtitle">Manage your household inventory with ease.</p>

        <div *ngIf="authError" class="error-banner">
          <span class="material-symbols-outlined">error</span>
          <span>{{ authError }}</span>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="auth-form">
          <label class="field">
            <span>Email address</span>
            <input
              type="email"
              formControlName="email"
              autocomplete="email"
              placeholder="Enter your email"
            />
          </label>

          <label class="field">
            <span>Password</span>
            <div class="password-field">
              <input
                [type]="showPassword ? 'text' : 'password'"
                formControlName="password"
                autocomplete="current-password"
                placeholder="Enter your password"
              />
              <button class="icon-button" type="button" (click)="togglePassword()">
                <span class="material-symbols-outlined">visibility</span>
              </button>
            </div>
          </label>

          <div class="actions-row">
            <a routerLink="/auth/reset-password">Forgot Password?</a>
          </div>

          <button class="primary-button" type="submit" [disabled]="loading">
            Log In
          </button>
        </form>

        <div class="divider">
          <span></span>
          <p>Or continue with</p>
          <span></span>
        </div>

        <div class="social-grid">
          <button type="button">
            <img alt="Google" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAB2ktRob8A_aqxqIj5tDrBNINoIsnADdsCXPfikeeU07sSqphQRCuJuOQIxDRk-P3f8catOYoow88fU49u_TaR4WXvgcRWUU6wJ6wiBWpIkdVAAULJ9mPsO9-Z0eE4V6FXiMXP1boJfFUaWstBkhjpN0slW9Brc_SVHLt5eNLJIEgXLoN6XuvkEY1E90z_D4JkVGmcQwVE_as4a-QfdhiDho6jtxesiKcv5_NXmCCbSPvejhIuPQA0us3VfadDdXRLl_D5tUdZVgQ" />
            Google
          </button>
          <button type="button">
            <span class="material-symbols-outlined">ios</span>
            Apple
          </button>
        </div>

        <div class="footer-link">
          <p>
            Don't have an account?
            <a routerLink="/auth/register">Register</a>
          </p>
        </div>
      </main>

      <div class="scan-hint">
        <span class="material-symbols-outlined">qr_code_scanner</span>
        <span class="material-symbols-outlined">nfc</span>
        <span class="material-symbols-outlined">psychology</span>
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
      }

      .top-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 0 8px;
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
        margin: 0 auto;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding-top: 24px;
      }

      .logo {
        width: 64px;
        height: 64px;
        border-radius: 18px;
        background: rgba(19, 236, 200, 0.2);
        border: 1px solid rgba(19, 236, 200, 0.4);
        display: grid;
        place-items: center;
        margin: 0 auto;
      }

      .logo span {
        font-size: 32px;
        color: #13ecc8;
      }

      h1 {
        font-size: 32px;
        margin: 0;
        text-align: center;
      }

      .subtitle {
        margin: 0;
        text-align: center;
        color: #9db9b4;
      }

      .error-banner {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px;
        border-radius: 12px;
        border: 1px solid rgba(248, 113, 113, 0.4);
        background: rgba(248, 113, 113, 0.1);
        color: #f87171;
        font-size: 14px;
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
        border-radius: 14px;
        border: 1px solid #3b544f;
        background: #1c2725;
        color: #fff;
        padding: 14px 16px;
        font-size: 16px;
      }

      .password-field {
        display: flex;
        align-items: center;
        border-radius: 14px;
        border: 1px solid #3b544f;
        background: #1c2725;
        overflow: hidden;
      }

      .password-field input {
        border: none;
        background: transparent;
        flex: 1;
      }

      .actions-row {
        text-align: right;
      }

      .actions-row a {
        color: #13ecc8;
        text-decoration: none;
        font-weight: 600;
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

      .divider {
        display: flex;
        align-items: center;
        gap: 12px;
        color: #9db9b4;
        font-size: 14px;
        margin: 8px 0;
      }

      .divider span {
        flex: 1;
        height: 1px;
        background: #3b544f;
      }

      .social-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }

      .social-grid button {
        height: 56px;
        border-radius: 16px;
        border: 1px solid #3b544f;
        background: #1c2725;
        color: #fff;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .social-grid img {
        width: 24px;
        height: 24px;
      }

      .footer-link {
        text-align: center;
        color: #9db9b4;
        margin-top: 16px;
      }

      .footer-link a {
        color: #13ecc8;
        font-weight: 700;
        text-decoration: none;
      }

      .scan-hint {
        margin-top: auto;
        display: flex;
        justify-content: center;
        gap: 24px;
        opacity: 0.2;
        padding-top: 24px;
      }
    `
  ]
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  loading = false;
  showPassword = false;
  authError: string | null = null;

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [false]
  });

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.authError = null;
    const { email, password } = this.form.getRawValue();
    this.authService.login({ email, password }).subscribe({
      next: () => this.router.navigate(['/app/inventories']),
      error: () => {
        this.authError = '401: Unauthorized. Please check your credentials.';
        this.loading = false;
      },
      complete: () => (this.loading = false)
    });
  }
}

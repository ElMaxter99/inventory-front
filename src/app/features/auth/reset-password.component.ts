import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-screen">
      <header class="top-bar">
        <button class="icon-button" type="button">
          <span class="material-symbols-outlined">arrow_back_ios</span>
        </button>
        <h2>Reset Password</h2>
      </header>

      <main class="auth-card">
        <h1>Forgot your password?</h1>
        <p class="subtitle">
          Enter the email address associated with your household account. We'll send a link to reset
          your password and get you back to managing your items.
        </p>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="auth-form">
          <label class="field">
            <span>Email Address</span>
            <div class="input-with-icon">
              <input
                type="email"
                formControlName="email"
                autocomplete="email"
                placeholder="e.g., name@email.com"
              />
              <span class="material-symbols-outlined">mail</span>
            </div>
          </label>

          <button class="primary-button" type="submit" [disabled]="form.invalid">
            Send Reset Link
          </button>
        </form>

        <div class="hint-card">
          <span class="material-symbols-outlined">inventory_2</span>
        </div>

        <div class="footer-link">
          <a routerLink="/auth/login">
            <span class="material-symbols-outlined">login</span>
            Back to Login
          </a>
          <div class="brand">
            <span class="material-symbols-outlined">qr_code_2</span>
            <span>Household OS</span>
          </div>
        </div>
      </main>
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
      }

      .top-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 0;
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

      h1 {
        margin: 0;
        font-size: 32px;
      }

      .subtitle {
        color: #9db9b4;
      }

      .auth-form {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .field span {
        display: block;
        font-size: 14px;
        margin-bottom: 8px;
      }

      .input-with-icon {
        display: flex;
        align-items: center;
        border-radius: 16px;
        border: 1px solid #3b544f;
        background: #1c2725;
        padding: 0 16px;
      }

      .input-with-icon input {
        flex: 1;
        border: none;
        background: transparent;
        color: #fff;
        padding: 14px 0;
        font-size: 16px;
      }

      .input-with-icon span {
        color: #9db9b4;
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

      .hint-card {
        height: 128px;
        border-radius: 24px;
        border: 1px dashed rgba(19, 236, 200, 0.3);
        background: linear-gradient(135deg, rgba(19, 236, 200, 0.1), transparent);
        display: grid;
        place-items: center;
        opacity: 0.6;
      }

      .hint-card span {
        font-size: 48px;
        color: #13ecc8;
      }

      .footer-link {
        margin-top: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        color: #13ecc8;
      }

      .footer-link a {
        color: #13ecc8;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 10px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        opacity: 0.5;
        color: #9db9b4;
      }
    `
  ]
})
export class ResetPasswordComponent {
  private readonly fb = new FormBuilder();

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
  }
}

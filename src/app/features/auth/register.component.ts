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
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
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
    const { name, email, password, confirmPassword } = this.form.getRawValue();
    if (password !== confirmPassword) {
      this.notificationService.show('Las contraseñas no coinciden.');
      this.loading = false;
      return;
    }
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

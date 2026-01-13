import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SessionStore } from '../../core/stores/session.store';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { environment } from '../../../environments/environment';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatSlideToggleModule
  ],
  template: `
    <mat-sidenav-container class="shell">
      <mat-sidenav
        #sidenav
        [mode]="isHandset() ? 'over' : 'side'"
        [opened]="!isHandset()"
        class="shell-sidenav"
      >
        <div class="logo">
          <mat-icon>inventory_2</mat-icon>
          <span>{{ appName }}</span>
        </div>
        <mat-nav-list>
          <a mat-list-item routerLink="/app/inventories" routerLinkActive="active">Inventarios</a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button mat-icon-button (click)="sidenav.toggle()" aria-label="Abrir menú">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="spacer"></span>
          <mat-slide-toggle (change)="toggleTheme()" [checked]="theme() === 'dark'">
            Modo oscuro
          </mat-slide-toggle>
          <button mat-icon-button (click)="logout()" aria-label="Cerrar sesión">
            <mat-icon>logout</mat-icon>
          </button>
        </mat-toolbar>
        <main class="shell-content">
          <router-outlet></router-outlet>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      .shell {
        min-height: 100vh;
        background: var(--app-background);
      }

      .shell-sidenav {
        width: 260px;
        background: var(--app-surface);
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 1.5rem;
        font-weight: 600;
      }

      .shell-content {
        padding: 1.5rem;
      }

      .spacer {
        flex: 1;
      }

      @media (max-width: 768px) {
        .shell-content {
          padding: 1rem;
        }
      }
    `
  ]
})
export class AppShellComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly sessionStore = inject(SessionStore);
  private readonly themeService = inject(ThemeService);

  readonly appName = environment.appName;
  readonly theme = this.themeService.theme;
  readonly isHandset = signal(false);

  constructor() {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state) => this.isHandset.set(state.matches));
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  logout(): void {
    this.authService.logout().subscribe({
      complete: () => this.sessionStore.clear()
    });
  }
}

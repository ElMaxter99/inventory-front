import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-inventory-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, RouterLinkActive],
  template: `
    <div class="dashboard-shell">
      <header class="top-app-bar">
        <div class="top-row">
          <div class="breadcrumb">
            <button class="icon-button" type="button">
              <mat-icon>arrow_back_ios</mat-icon>
            </button>
            <div>
              <p class="breadcrumb-label">Home &gt; Perfil</p>
              <h1 class="breadcrumb-title">Profile</h1>
            </div>
          </div>
          <div class="top-actions">
            <button class="icon-button" type="button">
              <mat-icon>qr_code_scanner</mat-icon>
            </button>
            <a
              class="avatar-button"
              [routerLink]="['/app/inventories', inventoryId, 'members']"
              routerLinkActive="active"
            >
              <span class="avatar">JD</span>
            </a>
          </div>
        </div>
        <nav class="tabs">
          <a
            class="tab"
            [routerLink]="['/app/inventories', inventoryId, 'zones']"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            >Zones</a
          >
          <a
            class="tab"
            [routerLink]="['/app/inventories', inventoryId, 'members']"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            >Members</a
          >
          <a
            class="tab"
            [routerLink]="['/app/inventories', inventoryId, 'settings']"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            >Settings</a
          >
        </nav>
      </header>

      <main class="dashboard-body">
        <section class="profile-card">
          <div class="profile-header">
            <div class="profile-avatar">JD</div>
            <div>
              <h3>Julia Díaz</h3>
              <p>Inventory Lead · Zona principal</p>
            </div>
          </div>
          <div class="panel-meta">
            <span class="panel-chip">Owner</span>
            <span>Último acceso: hoy 08:45</span>
          </div>
        </section>

        <section class="section-title">Preferencias</section>
        <section class="panel-grid">
          <article class="panel-card">
            <h3>Modo oscuro</h3>
            <p>Activo · sincronizado con dispositivo.</p>
          </article>
          <article class="panel-card">
            <h3>Alertas</h3>
            <p>Recibir resúmenes diarios a las 9:00 AM.</p>
          </article>
          <article class="panel-card">
            <h3>Zona favorita</h3>
            <p>“Cocina” marcada como vista principal.</p>
          </article>
        </section>
      </main>

      <nav class="bottom-nav">
        <a
          class="bottom-item"
          [routerLink]="['/app/inventories', inventoryId, 'zones']"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
        >
          <mat-icon>home</mat-icon>
          <span>Inventory</span>
        </a>
        <a
          class="bottom-item"
          [routerLink]="['/app/inventories', inventoryId, 'stats']"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
        >
          <mat-icon>analytics</mat-icon>
          <span>Stats</span>
        </a>
        <a
          class="bottom-item"
          [routerLink]="['/app/inventories', inventoryId, 'activity']"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
        >
          <mat-icon>notifications</mat-icon>
          <span>Activity</span>
        </a>
        <a
          class="bottom-item"
          [routerLink]="['/app/inventories', inventoryId, 'profile']"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
        >
          <mat-icon>person</mat-icon>
          <span>Profile</span>
        </a>
      </nav>
    </div>
  `,
  styleUrls: ['../inventory-shell.styles.scss']
})
export class InventoryProfileComponent {
  private readonly route = inject(ActivatedRoute);

  readonly inventoryId = this.route.snapshot.paramMap.get('inventoryId') ?? '';
}

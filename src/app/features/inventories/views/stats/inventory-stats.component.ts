import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-inventory-stats',
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
              <p class="breadcrumb-label">Home &gt; Métricas</p>
              <h1 class="breadcrumb-title">Stats</h1>
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
        <section class="panel-grid">
          <article class="panel-card">
            <h3>Objetos totales</h3>
            <p>1,245 items registrados en las zonas activas.</p>
            <div class="panel-meta">
              <span class="panel-chip">+8% semana</span>
              <span>Meta: 1,400</span>
            </div>
          </article>
          <article class="panel-card">
            <h3>Zona más activa</h3>
            <p>Cocina con 215 movimientos en el último mes.</p>
            <div class="panel-meta">
              <span class="panel-chip">Hot zone</span>
              <span>Última revisión: ayer</span>
            </div>
          </article>
          <article class="panel-card">
            <h3>Rotación</h3>
            <p>Promedio de 3.2 cambios por objeto.</p>
            <div class="panel-meta">
              <span>Tiempo medio: 12 días</span>
            </div>
          </article>
        </section>

        <section class="section-title">Objetivos</section>
        <section class="panel-grid">
          <article class="panel-card">
            <h3>Auditoría mensual</h3>
            <p>72% completada · quedan 4 zonas por revisar.</p>
          </article>
          <article class="panel-card">
            <h3>Items críticos</h3>
            <p>19 artículos requieren reabastecimiento.</p>
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
export class InventoryStatsComponent {
  private readonly route = inject(ActivatedRoute);

  readonly inventoryId = this.route.snapshot.paramMap.get('inventoryId') ?? '';
}

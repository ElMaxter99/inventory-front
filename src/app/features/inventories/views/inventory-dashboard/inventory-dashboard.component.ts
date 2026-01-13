import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { InventoryService } from '../../../../core/services/inventory.service';
import { ZoneService } from '../../../../core/services/zone.service';
import { InventoryDetailStore } from '../../../../core/stores/inventory-detail.store';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';

@Component({
  selector: 'app-inventory-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    LoadingStateComponent
  ],
  template: `
    <div class="dashboard-shell" [class.is-loading]="store.loading()">
      <header class="top-app-bar">
        <div class="top-row">
          <div class="breadcrumb">
            <button class="icon-button" type="button">
              <mat-icon>arrow_back_ios</mat-icon>
            </button>
            <div>
              <p class="breadcrumb-label">Home &gt; {{ store.inventory()?.name || 'Casa' }}</p>
              <h1 class="breadcrumb-title">{{ store.inventory()?.name || 'Casa' }}</h1>
            </div>
          </div>
          <div class="top-actions">
            <button class="icon-button" type="button">
              <mat-icon>qr_code_scanner</mat-icon>
            </button>
            <button class="avatar-button" type="button" (click)="goToMembers()">
              <span class="avatar">JD</span>
            </button>
          </div>
        </div>
        <nav class="tabs">
          <button class="tab active" type="button">Zones</button>
          <button class="tab" type="button">Members</button>
          <button class="tab" type="button">Settings</button>
        </nav>
      </header>

      <app-loading-state *ngIf="store.loading()"></app-loading-state>

      <main class="dashboard-body" *ngIf="!store.loading()">
        <section class="actions-bar">
          <div class="action-group">
            <button class="action" type="button">
              <span class="action-icon">
                <mat-icon>reorder</mat-icon>
              </span>
              <span class="action-label">Reorder</span>
            </button>
            <button class="action" type="button">
              <span class="action-icon">
                <mat-icon>auto_awesome</mat-icon>
              </span>
              <span class="action-label">AI Magic</span>
            </button>
          </div>
          <div class="role-pill">
            <span class="role-indicator"></span>
            <span>{{ (store.inventory()?.role || 'Editor') | titlecase }} Role</span>
          </div>
        </section>

        <section class="search-bar">
          <mat-icon>search</mat-icon>
          <input
            type="text"
            [placeholder]="'Search ' + store.zones().length + ' zones...'"
            aria-label="Buscar zonas"
          />
          <mat-icon class="mic">mic</mat-icon>
        </section>

        <section class="zones-grid">
          <button
            class="zone-card"
            *ngFor="let zone of store.zones(); let i = index"
            type="button"
            (click)="goToZone(zone.id)"
          >
            <div class="zone-card-top">
              <span class="zone-icon" [ngClass]="zoneAccent(i)">
                <mat-icon>{{ zoneIcon(i) }}</mat-icon>
              </span>
              <span class="zone-index">#{{ i + 1 | number: '2.0' }}</span>
            </div>
            <div class="zone-card-body">
              <h3>{{ zone.name }}</h3>
              <p>{{ zone.description || '0 items' }}</p>
            </div>
            <div class="zone-card-footer" *ngIf="i === 0">
              <span class="avatar-stack">AL</span>
              <span class="avatar-stack">RM</span>
              <span class="avatar-stack highlight">+1</span>
            </div>
          </button>

          <button class="zone-card add-card" type="button">
            <mat-icon>add_circle</mat-icon>
            <span>Add Zone</span>
          </button>
        </section>
      </main>

      <button class="fab" type="button">
        <mat-icon>add</mat-icon>
      </button>

      <nav class="bottom-nav">
        <div class="bottom-item active">
          <mat-icon>home</mat-icon>
          <span>Inventory</span>
        </div>
        <div class="bottom-item">
          <mat-icon>analytics</mat-icon>
          <span>Stats</span>
        </div>
        <div class="bottom-item">
          <mat-icon>notifications</mat-icon>
          <span>Activity</span>
        </div>
        <div class="bottom-item">
          <mat-icon>person</mat-icon>
          <span>Profile</span>
        </div>
      </nav>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .dashboard-shell {
        min-height: 100vh;
        background: linear-gradient(180deg, #0f201c 0%, #102624 45%, #0e1d1b 100%);
        color: #f5f7fb;
        position: relative;
        padding-bottom: 96px;
      }

      .top-app-bar {
        position: sticky;
        top: 0;
        z-index: 20;
        backdrop-filter: blur(20px);
        background: rgba(16, 34, 31, 0.85);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        padding: 16px 20px 0;
      }

      .top-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
      }

      .breadcrumb {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .breadcrumb-label {
        font-size: 10px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #39f1d0;
        margin: 0 0 4px;
        font-weight: 700;
      }

      .breadcrumb-title {
        margin: 0;
        font-size: 24px;
        font-weight: 700;
      }

      .icon-button {
        width: 40px;
        height: 40px;
        border-radius: 999px;
        border: none;
        background: rgba(255, 255, 255, 0.08);
        color: #f5f7fb;
        display: grid;
        place-items: center;
        cursor: pointer;
      }

      .icon-button mat-icon {
        font-size: 20px;
      }

      .top-actions {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .avatar-button {
        width: 40px;
        height: 40px;
        border-radius: 999px;
        border: none;
        padding: 0;
        overflow: hidden;
        background: linear-gradient(135deg, #13ecc8, #30c7a8);
        color: #0b1d19;
        font-weight: 700;
        cursor: pointer;
      }

      .avatar {
        display: grid;
        place-items: center;
        width: 100%;
        height: 100%;
        font-size: 12px;
      }

      .tabs {
        display: flex;
        gap: 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        margin-top: 12px;
      }

      .tab {
        flex: 1;
        padding: 16px 0 12px;
        border: none;
        background: transparent;
        color: rgba(255, 255, 255, 0.5);
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        border-bottom: 2px solid transparent;
      }

      .tab.active {
        color: #39f1d0;
        border-color: #39f1d0;
      }

      .dashboard-body {
        padding: 20px;
      }

      .actions-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
      }

      .action-group {
        display: flex;
        gap: 20px;
      }

      .action {
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, 0.7);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        cursor: pointer;
      }

      .action-icon {
        width: 44px;
        height: 44px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.08);
        display: grid;
        place-items: center;
        color: #b8d5cf;
      }

      .action-icon mat-icon {
        font-size: 20px;
      }

      .role-pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        border-radius: 12px;
        border: 1px solid rgba(57, 241, 208, 0.4);
        background: rgba(19, 236, 200, 0.12);
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #39f1d0;
      }

      .role-indicator {
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: #39f1d0;
        box-shadow: 0 0 8px rgba(57, 241, 208, 0.6);
      }

      .search-bar {
        margin-top: 20px;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        padding: 10px 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        border: 1px solid rgba(255, 255, 255, 0.12);
      }

      .search-bar input {
        flex: 1;
        background: transparent;
        border: none;
        color: #f5f7fb;
        font-size: 16px;
        outline: none;
      }

      .search-bar mat-icon {
        color: rgba(255, 255, 255, 0.45);
      }

      .search-bar .mic {
        font-size: 18px;
      }

      .zones-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 16px;
        margin-top: 20px;
      }

      .zone-card {
        background: rgba(24, 35, 37, 0.85);
        border-radius: 24px;
        padding: 16px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: #f5f7fb;
        display: flex;
        flex-direction: column;
        gap: 16px;
        text-align: left;
        transition: transform 0.2s ease;
      }

      .zone-card:hover {
        transform: translateY(-2px);
      }

      .zone-card-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .zone-icon {
        width: 42px;
        height: 42px;
        border-radius: 14px;
        display: grid;
        place-items: center;
      }

      .zone-icon mat-icon {
        font-size: 20px;
      }

      .accent-amber {
        background: rgba(255, 193, 7, 0.18);
        color: #ffc107;
      }

      .accent-blue {
        background: rgba(56, 126, 255, 0.2);
        color: #4d8dff;
      }

      .accent-purple {
        background: rgba(170, 99, 255, 0.2);
        color: #b17bff;
      }

      .accent-rose {
        background: rgba(255, 107, 129, 0.2);
        color: #ff6b81;
      }

      .zone-index {
        font-size: 12px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.35);
      }

      .zone-card-body h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
      }

      .zone-card-body p {
        margin: 6px 0 0;
        color: rgba(255, 255, 255, 0.55);
        font-size: 14px;
      }

      .zone-card-footer {
        display: flex;
        gap: 6px;
      }

      .avatar-stack {
        width: 24px;
        height: 24px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.2);
        border: 2px solid #0f201c;
        display: grid;
        place-items: center;
        font-size: 9px;
        font-weight: 700;
      }

      .avatar-stack.highlight {
        background: #39f1d0;
        color: #0b1d19;
      }

      .add-card {
        border: 2px dashed rgba(255, 255, 255, 0.2);
        background: transparent;
        color: rgba(255, 255, 255, 0.55);
        align-items: center;
        justify-content: center;
        text-transform: uppercase;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.18em;
        min-height: 160px;
      }

      .add-card mat-icon {
        font-size: 32px;
      }

      .fab {
        position: fixed;
        right: 24px;
        bottom: 88px;
        width: 56px;
        height: 56px;
        border-radius: 999px;
        border: none;
        background: #39f1d0;
        color: #0b1d19;
        display: grid;
        place-items: center;
        box-shadow: 0 16px 32px rgba(57, 241, 208, 0.3);
        cursor: pointer;
      }

      .bottom-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 12px 24px;
        display: flex;
        justify-content: space-between;
        background: rgba(16, 34, 31, 0.9);
        backdrop-filter: blur(20px);
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }

      .bottom-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        font-size: 10px;
        color: rgba(255, 255, 255, 0.4);
        font-weight: 600;
      }

      .bottom-item.active {
        color: #39f1d0;
      }

      .bottom-item mat-icon {
        font-size: 24px;
      }
    `
  ]
})
export class InventoryDashboardComponent {
  private readonly inventoryService = inject(InventoryService);
  private readonly zoneService = inject(ZoneService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly store = inject(InventoryDetailStore);
  readonly zoneIconList = ['restaurant', 'garage', 'weekend', 'inventory_2'];
  readonly zoneAccentList = ['accent-amber', 'accent-blue', 'accent-purple', 'accent-rose'];

  constructor() {
    const inventoryId = this.route.snapshot.paramMap.get('inventoryId') ?? '';
    this.loadInventory(inventoryId);
  }

  loadInventory(inventoryId: string): void {
    this.store.setLoading(true);
    this.inventoryService.getById(inventoryId).subscribe({
      next: (inventory) => this.store.setInventory(inventory),
      error: () => this.store.setLoading(false),
      complete: () => this.store.setLoading(false)
    });

    this.zoneService.list(inventoryId).subscribe({
      next: (zones) => this.store.setZones(zones)
    });
  }

  goToZone(zoneId: string): void {
    const inventoryId = this.store.inventory()?.id;
    if (inventoryId) {
      this.router.navigate(['/app/inventories', inventoryId, 'zones', zoneId]);
    }
  }

  goToMembers(): void {
    const inventoryId = this.store.inventory()?.id;
    if (inventoryId) {
      this.router.navigate(['/app/inventories', inventoryId, 'members']);
    }
  }

  zoneIcon(index: number): string {
    return this.zoneIconList[index % this.zoneIconList.length];
  }

  zoneAccent(index: number): string {
    return this.zoneAccentList[index % this.zoneAccentList.length];
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InventoryService } from '../../../../core/services/inventory.service';
import { ZoneService } from '../../../../core/services/zone.service';
import { InventoryDetailStore } from '../../../../core/stores/inventory-detail.store';
import { ZoneListComponent } from '../../components/zone-list/zone-list.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';

@Component({
  selector: 'app-inventory-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ZoneListComponent,
    LoadingStateComponent
  ],
  template: `
    <section class="header">
      <div>
        <h1>{{ store.inventory()?.name }}</h1>
        <p>{{ store.inventory()?.description }}</p>
      </div>
      <button mat-stroked-button color="primary" (click)="goToMembers()">
        <mat-icon>group</mat-icon>
        Miembros
      </button>
    </section>

    <app-loading-state *ngIf="store.loading()"></app-loading-state>

    <div class="dashboard" *ngIf="!store.loading()">
      <mat-card class="summary">
        <mat-card-title>Resumen</mat-card-title>
        <mat-card-content>
          <p>{{ store.zones().length }} zonas activas</p>
          <p>Acceso público: {{ store.inventory()?.isPublic ? 'Sí' : 'No' }}</p>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-title>Zonas</mat-card-title>
        <mat-card-content>
          <app-zone-list [zones]="store.zones()" (select)="goToZone($event.id)"></app-zone-list>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .dashboard {
        display: grid;
        gap: 1rem;
        grid-template-columns: minmax(240px, 320px) 1fr;
      }

      @media (max-width: 768px) {
        .dashboard {
          grid-template-columns: 1fr;
        }
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
}

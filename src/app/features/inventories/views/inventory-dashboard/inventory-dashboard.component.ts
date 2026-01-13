import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
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
    RouterLink,
    RouterLinkActive,
    LoadingStateComponent
  ],
  templateUrl: './inventory-dashboard.component.html',
  styleUrls: ['./inventory-dashboard.component.scss']
})
export class InventoryDashboardComponent {
  private readonly inventoryService = inject(InventoryService);
  private readonly zoneService = inject(ZoneService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly inventoryId = this.route.snapshot.paramMap.get('inventoryId') ?? '';
  readonly store = inject(InventoryDetailStore);
  readonly zoneIconList = ['restaurant', 'garage', 'weekend', 'inventory_2'];
  readonly zoneAccentList = ['accent-amber', 'accent-blue', 'accent-purple', 'accent-rose'];

  constructor() {
    this.loadInventory(this.inventoryId);
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

  zoneIcon(index: number): string {
    return this.zoneIconList[index % this.zoneIconList.length];
  }

  zoneAccent(index: number): string {
    return this.zoneAccentList[index % this.zoneAccentList.length];
  }
}

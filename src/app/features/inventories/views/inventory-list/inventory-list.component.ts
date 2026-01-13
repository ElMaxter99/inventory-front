import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InventoryService } from '../../../../core/services/inventory.service';
import { InventoriesStore } from '../../../../core/stores/inventories.store';
import { NotificationService } from '../../../../core/services/notification.service';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { InventoryCreateDialogComponent } from './inventory-create-dialog.component';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    LoadingStateComponent
  ],
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent {
  private readonly inventoryService = inject(InventoryService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  readonly store = inject(InventoriesStore);

  constructor() {
    this.loadInventories();
  }

  loadInventories(): void {
    this.store.setLoading(true);
    this.inventoryService.list().subscribe({
      next: (inventories) => this.store.setInventories(inventories),
      error: (error) => {
        this.store.setError(error.message ?? 'Error al cargar inventarios');
        this.store.setLoading(false);
      },
      complete: () => this.store.setLoading(false)
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(InventoryCreateDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      this.inventoryService.create(result).subscribe({
        next: (inventory) => this.store.setInventories([inventory, ...this.store.inventories()])
      });
    });
  }

  goToInventory(inventoryId: string): void {
    this.router.navigate(['/app/inventories', inventoryId]);
  }

  removeInventory(inventoryId: string): void {
    const previous = this.store.inventories();
    this.store.setInventories(this.store.inventories().filter((inv) => inv.id !== inventoryId));
    this.inventoryService.delete(inventoryId).subscribe({
      next: () => undefined,
      error: () => {
        this.store.setInventories(previous);
        this.notificationService.show('No se pudo eliminar el inventario.');
      }
    });
  }
}

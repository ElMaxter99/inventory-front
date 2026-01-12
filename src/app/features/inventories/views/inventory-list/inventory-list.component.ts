import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { InventoryService } from '../../../../core/services/inventory.service';
import { InventoriesStore } from '../../../../core/stores/inventories.store';
import { NotificationService } from '../../../../core/services/notification.service';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { InventoryCardComponent } from '../../components/inventory-card/inventory-card.component';
import { InventoryCreateDialogComponent } from './inventory-create-dialog.component';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    EmptyStateComponent,
    LoadingStateComponent,
    InventoryCardComponent
  ],
  template: `
    <section class="header">
      <div>
        <h1>Inventarios</h1>
        <p>Gestiona tus inventarios compartidos.</p>
      </div>
      <button mat-flat-button color="primary" (click)="openCreateDialog()">
        <mat-icon>add</mat-icon>
        Crear inventario
      </button>
    </section>

    <app-loading-state *ngIf="store.loading()"></app-loading-state>
    <app-empty-state
      *ngIf="!store.loading() && store.inventories().length === 0 && !store.error()"
      title="Sin inventarios"
      message="Crea tu primer inventario y comienza a organizar tus objetos."
    ></app-empty-state>
    <app-empty-state
      *ngIf="store.error()"
      title="No pudimos cargar tus inventarios"
      message="{{ store.error() }}"
      icon="error_outline"
    ></app-empty-state>

    <div class="grid" *ngIf="store.inventories().length">
      <app-inventory-card
        *ngFor="let inventory of store.inventories()"
        [inventory]="inventory"
        (open)="goToInventory(inventory.id)"
        (remove)="removeInventory(inventory.id)"
      ></app-inventory-card>
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

      .grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      }

      h1 {
        margin-bottom: 0.25rem;
      }
    `
  ]
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

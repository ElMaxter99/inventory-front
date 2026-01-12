import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Inventory } from '../../../../core/models/inventory.models';

@Component({
  selector: 'app-inventory-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <mat-card class="inventory-card">
      <mat-card-header>
        <mat-card-title>{{ inventory?.name }}</mat-card-title>
        <mat-card-subtitle>{{ inventory?.owner?.name }} · {{ inventory?.role }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <p>{{ inventory?.description || 'Sin descripción' }}</p>
        <span class="badge" [class.public]="inventory?.isPublic">
          {{ inventory?.isPublic ? 'Público' : 'Privado' }}
        </span>
      </mat-card-content>
      <mat-card-actions align="end">
        <button mat-button color="primary" (click)="open.emit()">Abrir</button>
        <button mat-icon-button color="warn" (click)="remove.emit()" aria-label="Eliminar">
          <mat-icon>delete</mat-icon>
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [
    `
      .inventory-card {
        display: grid;
        gap: 0.5rem;
      }

      .badge {
        display: inline-flex;
        padding: 0.2rem 0.6rem;
        border-radius: 999px;
        background: rgba(63, 81, 181, 0.1);
        color: var(--app-primary);
        font-weight: 600;
      }

      .badge.public {
        background: rgba(0, 150, 136, 0.1);
        color: #009688;
      }
    `
  ]
})
export class InventoryCardComponent {
  @Input() inventory: Inventory | null = null;
  @Output() open = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();
}

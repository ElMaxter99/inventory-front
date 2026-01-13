import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Item } from '../../../../core/models/inventory.models';
import { TagChipsComponent } from '../../../../shared/components/tag-chips/tag-chips.component';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, TagChipsComponent],
  template: `
    <mat-card class="item-card">
      <div class="thumbnail">
        <img
          *ngIf="item?.photos?.length"
          [src]="item?.photos?.[0]"
          [alt]="item?.name"
        />
        <mat-icon *ngIf="!item?.photos?.length">inventory_2</mat-icon>
      </div>
      <div class="details">
        <div class="title">
          <span>{{ item?.name }}</span>
          <span class="count">x{{ item?.quantity }}</span>
        </div>
        <app-tag-chips [tags]="item?.tags ?? []"></app-tag-chips>
      </div>
      <div class="actions">
        <button mat-icon-button (click)="open.emit()" aria-label="Ver detalle">
          <mat-icon>open_in_new</mat-icon>
        </button>
        <button mat-icon-button color="warn" (click)="remove.emit()" aria-label="Eliminar">
          <mat-icon>delete</mat-icon>
        </button>
      </div>
    </mat-card>
  `,
  styles: [
    `
      .item-card {
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: 1rem;
        align-items: center;
      }

      .thumbnail {
        width: 64px;
        height: 64px;
        border-radius: 12px;
        background: var(--app-surface-strong);
        display: grid;
        place-items: center;
        overflow: hidden;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .title {
        display: flex;
        justify-content: space-between;
        font-weight: 600;
      }

      .count {
        color: var(--app-muted-text);
      }
    `
  ]
})
export class ItemCardComponent {
  @Input() item: Item | null = null;
  @Output() open = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();
}

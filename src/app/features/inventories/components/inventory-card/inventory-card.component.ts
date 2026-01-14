import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Inventory } from '../../../../core/models/inventory.models';

@Component({
  selector: 'app-inventory-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './inventory-card.component.html',
  styleUrls: ['./inventory-card.component.scss']
})
export class InventoryCardComponent {
  @Input() inventory: Inventory | null = null;
  @Output() open = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();
}

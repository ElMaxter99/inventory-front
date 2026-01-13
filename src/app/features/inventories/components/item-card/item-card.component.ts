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
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss']
})
export class ItemCardComponent {
  @Input() item: Item | null = null;
  @Output() open = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();
}

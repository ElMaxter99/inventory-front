import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Zone } from '../../../../core/models/inventory.models';

@Component({
  selector: 'app-zone-list',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule],
  templateUrl: './zone-list.component.html'
})
export class ZoneListComponent {
  @Input() zones: Zone[] = [];
  @Output() select = new EventEmitter<Zone>();
}

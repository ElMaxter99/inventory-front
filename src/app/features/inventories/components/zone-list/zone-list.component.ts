import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Zone } from '../../../../core/models/inventory.models';

@Component({
  selector: 'app-zone-list',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule],
  template: `
    <mat-nav-list>
      <a
        mat-list-item
        *ngFor="let zone of zones"
        (click)="select.emit(zone)"
        tabindex="0"
      >
        <mat-icon matListItemIcon>room</mat-icon>
        <div matListItemTitle>{{ zone.name }}</div>
        <div matListItemLine>{{ zone.description }}</div>
      </a>
    </mat-nav-list>
  `
})
export class ZoneListComponent {
  @Input() zones: Zone[] = [];
  @Output() select = new EventEmitter<Zone>();
}

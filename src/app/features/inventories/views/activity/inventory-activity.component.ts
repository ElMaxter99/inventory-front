import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-inventory-activity',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './inventory-activity.component.html',
  styleUrls: ['../inventory-shell.styles.scss']
})
export class InventoryActivityComponent {
  private readonly route = inject(ActivatedRoute);

  readonly inventoryId = this.route.snapshot.paramMap.get('inventoryId') ?? '';
}

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MembersComponent } from './members.component';

@Component({
  selector: 'app-inventory-members-view',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, RouterLinkActive, MembersComponent],
  templateUrl: './inventory-members-view.component.html',
  styleUrls: ['../inventory-shell.styles.scss']
})
export class InventoryMembersViewComponent {
  private readonly route = inject(ActivatedRoute);

  readonly inventoryId = this.route.snapshot.paramMap.get('inventoryId') ?? '';
}

import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InventoryMember, InventoryRole } from '../../../../core/models/inventory.models';

@Component({
  selector: 'app-member-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './member-table.component.html',
  styleUrls: ['./member-table.component.scss']
})
export class MemberTableComponent {
  @Input() members: InventoryMember[] = [];
  @Input() roles: InventoryRole[] = ['owner', 'admin', 'editor', 'viewer'];
  @Output() roleChange = new EventEmitter<{ member: InventoryMember; role: InventoryRole }>();
  @Output() remove = new EventEmitter<InventoryMember>();

  displayedColumns: string[] = ['name', 'email', 'role', 'actions'];
}

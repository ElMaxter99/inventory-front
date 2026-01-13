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
  template: `
    <table mat-table [dataSource]="members" class="mat-elevation-z1">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Nombre</th>
        <td mat-cell *matCellDef="let member">{{ member.user.name }}</td>
      </ng-container>

      <ng-container matColumnDef="email">
        <th mat-header-cell *matHeaderCellDef>Email</th>
        <td mat-cell *matCellDef="let member">{{ member.user.email }}</td>
      </ng-container>

      <ng-container matColumnDef="role">
        <th mat-header-cell *matHeaderCellDef>Rol</th>
        <td mat-cell *matCellDef="let member">
          <mat-form-field appearance="outline">
            <mat-select [value]="member.role" (selectionChange)="roleChange.emit({ member, role: $event.value })">
              <mat-option *ngFor="let role of roles" [value]="role">{{ role }}</mat-option>
            </mat-select>
          </mat-form-field>
        </td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let member">
          <button mat-button color="warn" (click)="remove.emit(member)">Eliminar</button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  styles: [
    `
      table {
        width: 100%;
      }

      mat-form-field {
        width: 140px;
      }
    `
  ]
})
export class MemberTableComponent {
  @Input() members: InventoryMember[] = [];
  @Input() roles: InventoryRole[] = ['owner', 'admin', 'editor', 'viewer'];
  @Output() roleChange = new EventEmitter<{ member: InventoryMember; role: InventoryRole }>();
  @Output() remove = new EventEmitter<InventoryMember>();

  displayedColumns: string[] = ['name', 'email', 'role', 'actions'];
}

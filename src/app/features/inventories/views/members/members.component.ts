import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { InventoryService } from '../../../../core/services/inventory.service';
import { InventoryMember, InventoryRole } from '../../../../core/models/inventory.models';
import { MemberTableComponent } from '../../components/member-table/member-table.component';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MemberTableComponent
  ],
  template: `
    <mat-card>
      <mat-card-title>Miembros</mat-card-title>
      <mat-card-content>
        <form [formGroup]="inviteForm" class="invite">
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Rol</mat-label>
            <mat-select formControlName="role">
              <mat-option *ngFor="let role of roles" [value]="role">{{ role }}</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-flat-button color="primary" (click)="invite()" [disabled]="inviteForm.invalid">
            Invitar
          </button>
        </form>
        <app-member-table
          [members]="members"
          [roles]="roles"
          (roleChange)="updateRole($event.member, $event.role)"
          (remove)="removeMember($event)"
        ></app-member-table>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .invite {
        display: grid;
        grid-template-columns: 1fr 180px auto;
        gap: 1rem;
        align-items: center;
        margin-bottom: 1.5rem;
      }

      @media (max-width: 768px) {
        .invite {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class MembersComponent {
  private readonly inventoryService = inject(InventoryService);
  private readonly route = inject(ActivatedRoute);

  readonly roles: InventoryRole[] = ['owner', 'admin', 'editor', 'viewer'];
  members: InventoryMember[] = [];

  readonly inviteForm = new FormBuilder().nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    role: ['viewer', [Validators.required]]
  });

  constructor() {
    this.loadMembers();
  }

  loadMembers(): void {
    const inventoryId = this.route.snapshot.paramMap.get('inventoryId') ?? '';
    this.inventoryService.listMembers(inventoryId).subscribe({
      next: (members) => (this.members = members)
    });
  }

  invite(): void {
    const inventoryId = this.route.snapshot.paramMap.get('inventoryId') ?? '';
    if (this.inviteForm.invalid) {
      return;
    }
    this.inventoryService.inviteMember(inventoryId, this.inviteForm.getRawValue()).subscribe({
      next: () => this.loadMembers()
    });
  }

  updateRole(member: InventoryMember, role: InventoryRole): void {
    const inventoryId = this.route.snapshot.paramMap.get('inventoryId') ?? '';
    this.inventoryService.updateMember(inventoryId, member.id, role).subscribe({
      next: () => this.loadMembers()
    });
  }

  removeMember(member: InventoryMember): void {
    const inventoryId = this.route.snapshot.paramMap.get('inventoryId') ?? '';
    this.inventoryService.removeMember(inventoryId, member.id).subscribe({
      next: () => this.loadMembers()
    });
  }
}

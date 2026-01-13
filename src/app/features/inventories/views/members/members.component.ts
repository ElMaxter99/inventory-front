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
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
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

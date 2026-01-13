import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LocatorService } from '../../../../core/services/locator.service';
import { Locator, LocatorTargetType } from '../../../../core/models/inventory.models';
import { LocatorListComponent } from '../../components/locator-list/locator-list.component';

@Component({
  selector: 'app-locators',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    LocatorListComponent
  ],
  template: `
    <mat-card>
      <mat-card-title>Locators (QR/NFC)</mat-card-title>
      <mat-card-content>
        <form [formGroup]="locatorForm" class="locator-form">
          <mat-form-field appearance="outline">
            <mat-label>Tipo</mat-label>
            <mat-select formControlName="targetType">
              <mat-option value="inventory">Inventario</mat-option>
              <mat-option value="zone">Zona</mat-option>
              <mat-option value="item">Item</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>ID destino</mat-label>
            <input matInput formControlName="targetId" />
          </mat-form-field>
          <mat-slide-toggle formControlName="isPublic">Público</mat-slide-toggle>
          <mat-slide-toggle formControlName="publicEditEnabled">Edición pública</mat-slide-toggle>
          <button mat-flat-button color="primary" (click)="createLocator()" [disabled]="locatorForm.invalid">
            Crear locator
          </button>
        </form>
        <app-locator-list
          [locators]="locators"
          (copy)="copyLink($event)"
          (remove)="deleteLocator($event)"
        ></app-locator-list>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .locator-form {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 1rem;
        align-items: center;
        margin-bottom: 1.5rem;
      }
    `
  ]
})
export class LocatorsComponent {
  private readonly locatorService = inject(LocatorService);
  private readonly route = inject(ActivatedRoute);

  locators: Locator[] = [];

  readonly locatorForm = new FormBuilder().nonNullable.group({
    targetType: ['inventory' as LocatorTargetType, [Validators.required]],
    targetId: ['', [Validators.required]],
    isPublic: [true],
    publicEditEnabled: [false]
  });

  constructor() {
    this.loadLocators();
  }

  loadLocators(): void {
    const inventoryId = this.route.snapshot.paramMap.get('inventoryId') ?? '';
    this.locatorService.list(inventoryId).subscribe({
      next: (locators) => (this.locators = locators)
    });
  }

  createLocator(): void {
    const inventoryId = this.route.snapshot.paramMap.get('inventoryId') ?? '';
    const payload = this.locatorForm.getRawValue();
    this.locatorService.create(inventoryId, payload).subscribe({
      next: (locator) => (this.locators = [locator, ...this.locators])
    });
  }

  deleteLocator(locator: Locator): void {
    this.locatorService.delete(locator.id).subscribe({
      next: () => (this.locators = this.locators.filter((entry) => entry.id !== locator.id))
    });
  }

  copyLink(link: string): void {
    navigator.clipboard.writeText(link).catch(() => undefined);
  }
}

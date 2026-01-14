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
  templateUrl: './locators.component.html',
  styleUrls: ['./locators.component.scss']
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
    const inventoryId = this.route.snapshot.paramMap.get('inventoryId') ?? '';
    this.locatorService.delete(inventoryId, locator.id).subscribe({
      next: () => (this.locators = this.locators.filter((entry) => entry.id !== locator.id))
    });
  }

  copyLink(link: string): void {
    navigator.clipboard.writeText(link).catch(() => undefined);
  }
}

import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { ItemCardComponent } from '../../components/item-card/item-card.component';
import { ItemService } from '../../../../core/services/item.service';
import { ZoneItemsStore } from '../../../../core/stores/zone-items.store';

@Component({
  selector: 'app-zone-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    BreadcrumbComponent,
    ItemCardComponent
  ],
  templateUrl: './zone-detail.component.html',
  styleUrls: ['./zone-detail.component.scss']
})
export class ZoneDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly itemService = inject(ItemService);
  private readonly destroyRef = inject(DestroyRef);

  readonly store = inject(ZoneItemsStore);
  readonly zoneId = this.route.snapshot.paramMap.get('zoneId') ?? '';
  readonly inventoryId = this.route.snapshot.paramMap.get('inventoryId') ?? '';
  readonly breadcrumbs = signal([
    { label: 'Inventarios', link: '/app/inventories' },
    { label: `Zona ${this.zoneId}`, link: null }
  ]);

  readonly filters = new FormBuilder().group({
    search: [''],
    type: [''],
    tag: ['']
  });

  constructor() {
    this.loadItems();
    this.filters.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loadItems());
  }

  loadItems(): void {
    const { search, tag, type } = this.filters.value;
    this.itemService
      .list(this.inventoryId, this.zoneId, {
        search: search ?? '',
        tag: tag ?? '',
        type: type ?? ''
      })
      .subscribe({
        next: (items) => this.store.setItems(items)
      });
  }

  createItem(isContainer: boolean): void {
    this.itemService
      .create(this.inventoryId, this.zoneId, {
        name: isContainer ? 'Nueva caja' : 'Nuevo item',
        quantity: 1,
        tags: [],
        attributes: [],
        photos: [],
        isContainer
      })
      .subscribe({
        next: () => this.loadItems()
      });
  }

  openItem(itemId: string): void {
    this.router.navigate(['/app/inventories', this.inventoryId, 'items', itemId]);
  }

  removeItem(itemId: string): void {
    this.itemService.delete(this.inventoryId, itemId).subscribe({
      next: () => this.loadItems()
    });
  }
}

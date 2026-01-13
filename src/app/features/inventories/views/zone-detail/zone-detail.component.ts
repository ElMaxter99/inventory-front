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
  template: `
    <app-breadcrumb [items]="breadcrumbs()"></app-breadcrumb>

    <section class="header">
      <div>
        <h2>Zona: {{ zoneId }}</h2>
        <p>Filtra por nombre, tags o tipo de item.</p>
      </div>
      <div class="actions">
        <button mat-flat-button color="primary" (click)="createItem(false)">
          <mat-icon>add</mat-icon>
          Añadir item
        </button>
        <button mat-stroked-button color="primary" (click)="createItem(true)">
          <mat-icon>add_box</mat-icon>
          Añadir caja
        </button>
      </div>
    </section>

    <form class="filters" [formGroup]="filters">
      <mat-form-field appearance="outline">
        <mat-label>Buscar</mat-label>
        <input matInput formControlName="search" />
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Tipo</mat-label>
        <mat-select formControlName="type">
          <mat-option value="">Todos</mat-option>
          <mat-option value="object">Objeto</mat-option>
          <mat-option value="container">Contenedor</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Tag</mat-label>
        <input matInput formControlName="tag" />
      </mat-form-field>
    </form>

    <div class="items">
      <app-item-card
        *ngFor="let item of store.items()"
        [item]="item"
        (open)="openItem(item.id)"
        (remove)="removeItem(item.id)"
      ></app-item-card>
    </div>
  `,
  styles: [
    `
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin: 1.5rem 0;
      }

      .actions {
        display: flex;
        gap: 0.75rem;
      }

      .filters {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .items {
        display: grid;
        gap: 1rem;
      }
    `
  ]
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

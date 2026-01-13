import { Injectable, computed, signal } from '@angular/core';
import { Item } from '../models/inventory.models';

export interface ZoneItemsQuery {
  search?: string;
  tag?: string;
  type?: 'object' | 'container';
  parentItemId?: string | null;
  page?: number;
  pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class ZoneItemsStore {
  private readonly itemsSignal = signal<Item[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly querySignal = signal<ZoneItemsQuery>({ page: 1, pageSize: 20 });

  readonly items = computed(() => this.itemsSignal());
  readonly loading = computed(() => this.loadingSignal());
  readonly query = computed(() => this.querySignal());

  setItems(items: Item[]): void {
    this.itemsSignal.set(items);
  }

  setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }

  updateQuery(partial: ZoneItemsQuery): void {
    this.querySignal.set({ ...this.querySignal(), ...partial });
  }
}

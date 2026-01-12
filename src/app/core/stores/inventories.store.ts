import { Injectable, computed, signal } from '@angular/core';
import { Inventory } from '../models/inventory.models';

@Injectable({ providedIn: 'root' })
export class InventoriesStore {
  private readonly inventoriesSignal = signal<Inventory[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly inventories = computed(() => this.inventoriesSignal());
  readonly loading = computed(() => this.loadingSignal());
  readonly error = computed(() => this.errorSignal());

  setInventories(inventories: Inventory[]): void {
    this.inventoriesSignal.set(inventories);
  }

  setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }

  setError(error: string | null): void {
    this.errorSignal.set(error);
  }
}

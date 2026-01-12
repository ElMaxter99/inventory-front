import { Injectable, computed, signal } from '@angular/core';
import { Inventory, Zone } from '../models/inventory.models';

@Injectable({ providedIn: 'root' })
export class InventoryDetailStore {
  private readonly inventorySignal = signal<Inventory | null>(null);
  private readonly zonesSignal = signal<Zone[]>([]);
  private readonly loadingSignal = signal(false);

  readonly inventory = computed(() => this.inventorySignal());
  readonly zones = computed(() => this.zonesSignal());
  readonly loading = computed(() => this.loadingSignal());

  setInventory(inventory: Inventory | null): void {
    this.inventorySignal.set(inventory);
  }

  setZones(zones: Zone[]): void {
    this.zonesSignal.set(zones);
  }

  setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }
}

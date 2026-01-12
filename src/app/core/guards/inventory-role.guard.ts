import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';
import { InventoryRole } from '../models/inventory.models';
import { InventoryDetailStore } from '../stores/inventory-detail.store';
import { InventoryService } from '../services/inventory.service';

const roleRank: Record<InventoryRole, number> = {
  owner: 4,
  admin: 3,
  editor: 2,
  viewer: 1
};

export const inventoryRoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const inventoryStore = inject(InventoryDetailStore);
  const inventoryService = inject(InventoryService);
  const minRole = (route.data['minRole'] as InventoryRole) ?? 'viewer';
  const inventoryId = route.paramMap.get('inventoryId');

  if (!inventoryId) {
    return router.createUrlTree(['/app/inventories']);
  }

  const cached = inventoryStore.inventory();
  const inventory$ =
    cached && cached.id === inventoryId
      ? of(cached)
      : inventoryService.getById(inventoryId).pipe(tap((inventory) => inventoryStore.setInventory(inventory)));

  return inventory$.pipe(
    map((inventory) => {
      const currentRole = inventory?.role ?? 'viewer';
      return roleRank[currentRole] >= roleRank[minRole]
        ? true
        : router.createUrlTree(['/app/inventories']);
    }),
    catchError(() => of(router.createUrlTree(['/app/inventories'])))
  );
};

import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { InventoryRole } from '../models/inventory.models';
import { InventoryDetailStore } from '../stores/inventory-detail.store';

const roleRank: Record<InventoryRole, number> = {
  owner: 4,
  admin: 3,
  editor: 2,
  viewer: 1
};

export const inventoryRoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const inventoryStore = inject(InventoryDetailStore);
  const minRole = (route.data['minRole'] as InventoryRole) ?? 'viewer';
  const currentRole = inventoryStore.inventory()?.role ?? 'viewer';

  if (roleRank[currentRole] >= roleRank[minRole]) {
    return true;
  }

  return router.createUrlTree(['/app/inventories']);
};

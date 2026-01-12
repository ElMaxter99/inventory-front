import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { inventoryRoleGuard } from './core/guards/inventory-role.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes)
  },
  {
    path: 'public/:token',
    loadComponent: () =>
      import('./features/public/public-view.component').then((m) => m.PublicViewComponent)
  },
  {
    path: 'app',
    loadComponent: () =>
      import('./features/shell/app-shell.component').then((m) => m.AppShellComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'inventories',
        loadComponent: () =>
          import('./features/inventories/views/inventory-list/inventory-list.component').then(
            (m) => m.InventoryListComponent
          )
      },
      {
        path: 'inventories/:inventoryId',
        loadComponent: () =>
          import(
            './features/inventories/views/inventory-dashboard/inventory-dashboard.component'
          ).then((m) => m.InventoryDashboardComponent)
      },
      {
        path: 'inventories/:inventoryId/zones/:zoneId',
        loadComponent: () =>
          import('./features/inventories/views/zone-detail/zone-detail.component').then(
            (m) => m.ZoneDetailComponent
          ),
        canActivate: [inventoryRoleGuard],
        data: { minRole: 'viewer' }
      },
      {
        path: 'inventories/:inventoryId/items/:itemId',
        loadComponent: () =>
          import('./features/inventories/views/item-detail/item-detail.component').then(
            (m) => m.ItemDetailComponent
          ),
        canActivate: [inventoryRoleGuard],
        data: { minRole: 'editor' }
      },
      {
        path: 'inventories/:inventoryId/members',
        loadComponent: () =>
          import('./features/inventories/views/members/members.component').then(
            (m) => m.MembersComponent
          ),
        canActivate: [inventoryRoleGuard],
        data: { minRole: 'admin' }
      },
      {
        path: 'inventories/:inventoryId/locators',
        loadComponent: () =>
          import('./features/inventories/views/locators/locators.component').then(
            (m) => m.LocatorsComponent
          ),
        canActivate: [inventoryRoleGuard],
        data: { minRole: 'admin' }
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'inventories'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];

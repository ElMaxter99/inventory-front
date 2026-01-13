# Inventario Hogar (Angular 20)

Frontend Angular standalone para una app de inventario doméstico con API REST (Node/Express/Mongo).

## Setup

```bash
npm install
npm start
```

## Scripts

```bash
npm run start
npm run build
npm run test
npm run lint
```

## Environments

Configura las variables en `src/environments`:

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000/api/v1',
  uploadsBaseUrl: 'http://localhost:3000',
  enablePublicEditWarnings: true,
  appName: 'Inventario Hogar'
};
```

La compilación `production` usa `environment.prod.ts`.

## Apuntar a la API

El cliente consume `{ apiBaseUrl }` para todas las rutas (auth, inventories, zones, items, locators). Para autenticación:

- Access token en memoria (session store).
- Refresh token vía `withCredentials: true` para soportar cookie httpOnly.

Si tu API usa refresh tokens en storage, puedes extender `SessionStore` para persistirlos.

## Flujo de permisos

Los roles por inventario son: `owner`, `admin`, `editor`, `viewer`.

- Owner/Admin: gestión total.
- Editor: CRUD en zonas/items, comentarios.
- Viewer: solo lectura.

El `inventoryRoleGuard` puede usarse para bloquear rutas por rol mínimo.

## Locators (QR/NFC) y `/public/:token`

- Crea locators desde **Inventarios > Locators**.
- Cada locator genera un link público y un QR en frontend (`qrcode`).
- Accede con `/public/:token` para vista pública.
- Si `publicEditEnabled` está activo, se muestra un banner de advertencia y se habilita el botón de edición.

## Arquitectura

```
src/app/
  core/         # servicios, guards, interceptors, stores
  shared/       # componentes reutilizables
  features/     # auth, inventories, public, shell
```

## Tests

Incluye pruebas mínimas para:
- `AuthService` y refresh interceptor.
- `InventoryListComponent` (error UI).
- `authGuard`.
- `ItemService` upload.

export type InventoryRole = 'owner' | 'admin' | 'editor' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Inventory {
  id: string;
  name: string;
  owner: User;
  role: InventoryRole;
  isPublic: boolean;
  publicEditEnabled?: boolean;
  description?: string;
}

export interface Zone {
  id: string;
  name: string;
  description?: string;
  order: number;
}

export interface ItemAttribute {
  key: string;
  value: string;
}

export interface Item {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  tags: string[];
  attributes: ItemAttribute[];
  photos: string[];
  isContainer: boolean;
  parentItemId?: string | null;
}

export interface ItemComment {
  id: string;
  message: string;
  author: User;
  createdAt: string;
}

export interface InventoryMember {
  id: string;
  user: User;
  role: InventoryRole;
}

export type LocatorTargetType = 'inventory' | 'zone' | 'item';

export interface Locator {
  id: string;
  token: string;
  targetType: LocatorTargetType;
  targetId: string;
  isPublic: boolean;
  publicEditEnabled: boolean;
  createdAt: string;
}

export interface LocatorResolution {
  token: string;
  targetType: LocatorTargetType;
  targetId: string;
  inventoryId: string;
  zoneId?: string | null;
  itemId?: string | null;
  isPublic: boolean;
  publicEditEnabled: boolean;
}

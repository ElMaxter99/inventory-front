import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api.models';
import { Inventory, InventoryMember } from '../models/inventory.models';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly baseUrl = `${environment.apiBaseUrl}/inventories`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<Inventory[]> {
    return this.http
      .get<ApiResponse<Inventory[]>>(this.baseUrl)
      .pipe(map((response) => response.data));
  }

  getById(inventoryId: string): Observable<Inventory> {
    return this.http
      .get<ApiResponse<Inventory>>(`${this.baseUrl}/${inventoryId}`)
      .pipe(map((response) => response.data));
  }

  create(payload: Partial<Inventory>): Observable<Inventory> {
    return this.http
      .post<ApiResponse<Inventory>>(this.baseUrl, payload)
      .pipe(map((response) => response.data));
  }

  update(inventoryId: string, payload: Partial<Inventory>): Observable<Inventory> {
    return this.http
      .patch<ApiResponse<Inventory>>(`${this.baseUrl}/${inventoryId}`, payload)
      .pipe(map((response) => response.data));
  }

  delete(inventoryId: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/${inventoryId}`)
      .pipe(map(() => undefined));
  }

  listMembers(inventoryId: string): Observable<InventoryMember[]> {
    return this.http
      .get<ApiResponse<InventoryMember[]>>(`${this.baseUrl}/${inventoryId}/members`)
      .pipe(map((response) => response.data));
  }

  inviteMember(inventoryId: string, payload: { email: string; role: string }): Observable<void> {
    return this.http
      .post<ApiResponse<void>>(`${this.baseUrl}/${inventoryId}/members`, payload)
      .pipe(map(() => undefined));
  }

  updateMember(inventoryId: string, memberId: string, role: string): Observable<void> {
    return this.http
      .patch<ApiResponse<void>>(`${this.baseUrl}/${inventoryId}/members/${memberId}`, { role })
      .pipe(map(() => undefined));
  }

  removeMember(inventoryId: string, memberId: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/${inventoryId}/members/${memberId}`)
      .pipe(map(() => undefined));
  }

  enablePublic(inventoryId: string): Observable<Inventory> {
    return this.http
      .post<ApiResponse<Inventory>>(`${this.baseUrl}/${inventoryId}/public/enable`, {})
      .pipe(map((response) => response.data));
  }

  disablePublic(inventoryId: string): Observable<Inventory> {
    return this.http
      .post<ApiResponse<Inventory>>(`${this.baseUrl}/${inventoryId}/public/disable`, {})
      .pipe(map((response) => response.data));
  }

  updatePublicSettings(
    inventoryId: string,
    payload: { isPublic?: boolean; publicEditEnabled?: boolean }
  ): Observable<Inventory> {
    return this.http
      .patch<ApiResponse<Inventory>>(`${this.baseUrl}/${inventoryId}/public`, payload)
      .pipe(map((response) => response.data));
  }
}

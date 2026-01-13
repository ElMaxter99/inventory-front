import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api.models';
import { Zone } from '../models/inventory.models';

@Injectable({ providedIn: 'root' })
export class ZoneService {
  private readonly baseUrl = `${environment.apiBaseUrl}/inventories`;

  constructor(private readonly http: HttpClient) {}

  list(inventoryId: string): Observable<Zone[]> {
    return this.http
      .get<ApiResponse<Zone[]>>(`${this.baseUrl}/${inventoryId}/zones`)
      .pipe(map((response) => response.data));
  }

  getById(inventoryId: string, zoneId: string): Observable<Zone> {
    return this.http
      .get<ApiResponse<Zone>>(`${this.baseUrl}/${inventoryId}/zones/${zoneId}`)
      .pipe(map((response) => response.data));
  }

  create(inventoryId: string, payload: Partial<Zone>): Observable<Zone> {
    return this.http
      .post<ApiResponse<Zone>>(`${this.baseUrl}/${inventoryId}/zones`, payload)
      .pipe(map((response) => response.data));
  }

  update(inventoryId: string, zoneId: string, payload: Partial<Zone>): Observable<Zone> {
    return this.http
      .patch<ApiResponse<Zone>>(`${this.baseUrl}/${inventoryId}/zones/${zoneId}`, payload)
      .pipe(map((response) => response.data));
  }

  delete(inventoryId: string, zoneId: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/${inventoryId}/zones/${zoneId}`)
      .pipe(map(() => undefined));
  }

  reorder(inventoryId: string, zoneIds: string[]): Observable<void> {
    return this.http
      .patch<ApiResponse<void>>(`${this.baseUrl}/${inventoryId}/zones/reorder`, { zoneIds })
      .pipe(map(() => undefined));
  }
}

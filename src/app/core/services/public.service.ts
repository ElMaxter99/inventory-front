import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api.models';
import { Inventory, Item, LocatorResolution } from '../models/inventory.models';

@Injectable({ providedIn: 'root' })
export class PublicService {
  private readonly baseUrl = `${environment.apiBaseUrl}/public`;

  constructor(private readonly http: HttpClient) {}

  getPublicInventory(token: string): Observable<Inventory> {
    return this.http
      .get<ApiResponse<Inventory>>(`${this.baseUrl}/inventories/${token}`)
      .pipe(map((response) => response.data));
  }

  getPublicLocator(token: string): Observable<LocatorResolution> {
    return this.http
      .get<ApiResponse<LocatorResolution>>(`${this.baseUrl}/locators/${token}`)
      .pipe(map((response) => response.data));
  }

  updatePublicItem(token: string, payload: Partial<Item>): Observable<Item> {
    return this.http
      .patch<ApiResponse<Item>>(`${this.baseUrl}/items/${token}`, payload)
      .pipe(map((response) => response.data));
  }
}

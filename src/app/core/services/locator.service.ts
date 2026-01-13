import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api.models';
import { Locator, LocatorResolution } from '../models/inventory.models';

@Injectable({ providedIn: 'root' })
export class LocatorService {
  private readonly baseUrl = `${environment.apiBaseUrl}/locators`;

  constructor(private readonly http: HttpClient) {}

  list(inventoryId: string): Observable<Locator[]> {
    return this.http
      .get<ApiResponse<Locator[]>>(`${environment.apiBaseUrl}/inventories/${inventoryId}/locators`)
      .pipe(map((response) => response.data));
  }

  create(inventoryId: string, payload: Partial<Locator>): Observable<Locator> {
    return this.http
      .post<ApiResponse<Locator>>(`${environment.apiBaseUrl}/inventories/${inventoryId}/locators`, payload)
      .pipe(map((response) => response.data));
  }

  update(inventoryId: string, locatorId: string, payload: Partial<Locator>): Observable<Locator> {
    return this.http
      .patch<ApiResponse<Locator>>(
        `${environment.apiBaseUrl}/inventories/${inventoryId}/locators/${locatorId}`,
        payload
      )
      .pipe(map((response) => response.data));
  }

  delete(inventoryId: string, locatorId: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(
        `${environment.apiBaseUrl}/inventories/${inventoryId}/locators/${locatorId}`
      )
      .pipe(map(() => undefined));
  }

  resolve(token: string): Observable<LocatorResolution> {
    return this.http
      .get<ApiResponse<LocatorResolution>>(`${this.baseUrl}/${token}`)
      .pipe(map((response) => response.data));
  }
}

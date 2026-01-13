import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api.models';
import { Item, ItemComment } from '../models/inventory.models';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private readonly baseUrl = `${environment.apiBaseUrl}/inventories`;

  constructor(private readonly http: HttpClient) {}

  listInventory(inventoryId: string): Observable<Item[]> {
    return this.http
      .get<ApiResponse<Item[]>>(`${this.baseUrl}/${inventoryId}/items`)
      .pipe(map((response) => response.data));
  }

  list(inventoryId: string, zoneId: string, params?: Record<string, string>): Observable<Item[]> {
    return this.http
      .get<ApiResponse<Item[]>>(`${this.baseUrl}/${inventoryId}/zones/${zoneId}/items`, { params })
      .pipe(map((response) => response.data));
  }

  getById(inventoryId: string, itemId: string): Observable<Item> {
    return this.http
      .get<ApiResponse<Item>>(`${this.baseUrl}/${inventoryId}/items/${itemId}`)
      .pipe(map((response) => response.data));
  }

  createInventoryItem(inventoryId: string, payload: Partial<Item>): Observable<Item> {
    return this.http
      .post<ApiResponse<Item>>(`${this.baseUrl}/${inventoryId}/items`, payload)
      .pipe(map((response) => response.data));
  }

  create(inventoryId: string, zoneId: string, payload: Partial<Item>): Observable<Item> {
    return this.http
      .post<ApiResponse<Item>>(`${this.baseUrl}/${inventoryId}/zones/${zoneId}/items`, payload)
      .pipe(map((response) => response.data));
  }

  update(inventoryId: string, itemId: string, payload: Partial<Item>): Observable<Item> {
    return this.http
      .patch<ApiResponse<Item>>(`${this.baseUrl}/${inventoryId}/items/${itemId}`, payload)
      .pipe(map((response) => response.data));
  }

  delete(inventoryId: string, itemId: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/${inventoryId}/items/${itemId}`)
      .pipe(map(() => undefined));
  }

  uploadPhoto(inventoryId: string, itemId: string, file: File): Observable<Item> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http
      .post<ApiResponse<Item>>(`${this.baseUrl}/${inventoryId}/items/${itemId}/photos`, formData)
      .pipe(map((response) => response.data));
  }

  deletePhoto(inventoryId: string, itemId: string, photoId: string): Observable<Item> {
    return this.http
      .delete<ApiResponse<Item>>(`${this.baseUrl}/${inventoryId}/items/${itemId}/photos/${photoId}`)
      .pipe(map((response) => response.data));
  }

  listComments(inventoryId: string, itemId: string): Observable<ItemComment[]> {
    return this.http
      .get<ApiResponse<ItemComment[]>>(`${this.baseUrl}/${inventoryId}/items/${itemId}/comments`)
      .pipe(map((response) => response.data));
  }

  addComment(inventoryId: string, itemId: string, message: string): Observable<ItemComment> {
    return this.http
      .post<ApiResponse<ItemComment>>(`${this.baseUrl}/${inventoryId}/items/${itemId}/comments`, {
        message
      })
      .pipe(map((response) => response.data));
  }

  deleteComment(inventoryId: string, itemId: string, commentId: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(
        `${this.baseUrl}/${inventoryId}/items/${itemId}/comments/${commentId}`
      )
      .pipe(map(() => undefined));
  }

  aiSuggest(inventoryId: string, itemId: string): Observable<{ suggestion: string }> {
    return this.http
      .post<ApiResponse<{ suggestion: string }>>(
        `${this.baseUrl}/${inventoryId}/items/${itemId}/ai/suggest`,
        {}
      )
      .pipe(map((response) => response.data));
  }
}

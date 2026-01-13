import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ItemService } from './item.service';
import { environment } from '../../../environments/environment';

describe('ItemService', () => {
  it('should build FormData for uploadPhoto', () => {
    TestBed.configureTestingModule({
      providers: [ItemService, provideHttpClient(), provideHttpClientTesting()]
    });

    const service = TestBed.inject(ItemService);
    const httpMock = TestBed.inject(HttpTestingController);

    const file = new File(['data'], 'photo.png', { type: 'image/png' });
    service.uploadPhoto('inv1', 'item1', file).subscribe();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/inventories/inv1/items/item1/photos`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTrue();

    httpMock.verify();
  });
});

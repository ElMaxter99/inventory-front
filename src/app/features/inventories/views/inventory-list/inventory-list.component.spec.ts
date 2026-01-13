import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventoryListComponent } from './inventory-list.component';
import { InventoriesStore } from '../../../../core/stores/inventories.store';
import { InventoryService } from '../../../../core/services/inventory.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

class InventoryServiceStub {
  list() {
    return { subscribe: () => undefined };
  }
}

describe('InventoryListComponent', () => {
  let fixture: ComponentFixture<InventoryListComponent>;
  let store: InventoriesStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryListComponent],
      providers: [
        InventoriesStore,
        { provide: InventoryService, useClass: InventoryServiceStub },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => ({ subscribe: () => undefined }) }) } },
        { provide: Router, useValue: { navigate: () => undefined } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryListComponent);
    store = TestBed.inject(InventoriesStore);
  });

  it('should render error empty state when store has error', () => {
    store.setError('Fallo al cargar');
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('No pudimos cargar tus inventarios');
    expect(text).toContain('Fallo al cargar');
  });
});

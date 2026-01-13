import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Locator } from '../../../../core/models/inventory.models';
import { toDataURL } from 'qrcode';

@Component({
  selector: 'app-locator-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="locator-grid">
      <mat-card *ngFor="let locator of locators" class="locator-card">
        <mat-card-title>{{ locator.targetType | titlecase }}</mat-card-title>
        <mat-card-content>
          <p>{{ maskToken(locator.token) }}</p>
          <img *ngIf="qrCodes[locator.id]" [src]="qrCodes[locator.id]" alt="QR" />
          <p>{{ publicUrl(locator.token) }}</p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-button (click)="copy.emit(publicUrl(locator.token))">Copiar link</button>
          <button mat-icon-button color="warn" (click)="remove.emit(locator)">
            <mat-icon>delete</mat-icon>
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .locator-grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      }

      .locator-card img {
        width: 120px;
        height: 120px;
      }
    `
  ]
})
export class LocatorListComponent implements OnChanges {
  @Input() locators: Locator[] = [];
  @Output() copy = new EventEmitter<string>();
  @Output() remove = new EventEmitter<Locator>();

  qrCodes: Record<string, string> = {};

  ngOnChanges(): void {
    this.locators.forEach((locator) => {
      const url = this.publicUrl(locator.token);
      toDataURL(url, { width: 200 }).then((qr) => (this.qrCodes[locator.id] = qr));
    });
  }

  publicUrl(token: string): string {
    return `${window.location.origin}/public/${token}`;
  }

  maskToken(token: string): string {
    return `${token.slice(0, 6)}...${token.slice(-4)}`;
  }
}

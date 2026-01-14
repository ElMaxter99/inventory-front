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
  templateUrl: './locator-list.component.html',
  styleUrls: ['./locator-list.component.scss']
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

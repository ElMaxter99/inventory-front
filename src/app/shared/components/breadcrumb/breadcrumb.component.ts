import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  link?: string | null;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  template: `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <ng-container *ngFor="let crumb of items; let last = last">
        <a *ngIf="crumb.link && !last" [routerLink]="crumb.link">{{ crumb.label }}</a>
        <span *ngIf="!crumb.link || last" class="current">{{ crumb.label }}</span>
        <mat-icon *ngIf="!last" aria-hidden="true">chevron_right</mat-icon>
      </ng-container>
    </nav>
  `,
  styles: [
    `
      .breadcrumb {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.9rem;
        color: var(--app-muted-text);
      }

      a {
        text-decoration: none;
        color: inherit;
      }

      .current {
        color: var(--app-text);
        font-weight: 600;
      }

      mat-icon {
        font-size: 1rem;
        height: 1rem;
        width: 1rem;
      }
    `
  ]
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
}

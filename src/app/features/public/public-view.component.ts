import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LocatorService } from '../../core/services/locator.service';
import { LocatorResolution } from '../../core/models/inventory.models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-public-view',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="public-wrapper">
      <mat-card *ngIf="resolution() as data">
        <mat-card-title>Vista pública</mat-card-title>
        <mat-card-subtitle>
          {{ data.targetType | titlecase }} · {{ data.targetId }}
        </mat-card-subtitle>
        <mat-card-content>
          <p *ngIf="data.publicEditEnabled && showWarning()" class="warning">
            Edición pública habilitada. Los cambios quedan auditados.
          </p>
          <p>Inventario: {{ data.inventoryId }}</p>
          <p>Zona: {{ data.zoneId || 'N/A' }}</p>
          <p>Item: {{ data.itemId || 'N/A' }}</p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-flat-button color="primary" [disabled]="!data.publicEditEnabled">
            Editar contenido
          </button>
        </mat-card-actions>
      </mat-card>
      <mat-card *ngIf="error()">
        <mat-card-title>Token inválido o sin permiso</mat-card-title>
        <mat-card-content>
          <p>{{ error() }}</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .public-wrapper {
        display: grid;
        place-items: center;
        min-height: 100vh;
        padding: 1.5rem;
      }

      .warning {
        padding: 0.75rem;
        border-radius: 12px;
        background: rgba(255, 152, 0, 0.1);
        color: #f57c00;
        font-weight: 600;
      }
    `
  ]
})
export class PublicViewComponent {
  private readonly locatorService = inject(LocatorService);
  private readonly route = inject(ActivatedRoute);

  readonly resolution = signal<LocatorResolution | null>(null);
  readonly error = signal<string | null>(null);
  readonly showWarning = signal(environment.enablePublicEditWarnings);

  constructor() {
    const token = this.route.snapshot.paramMap.get('token') ?? '';
    this.locatorService.resolve(token).subscribe({
      next: (data) => this.resolution.set(data),
      error: () => this.error.set('El token no es válido o expiró.')
    });
  }
}

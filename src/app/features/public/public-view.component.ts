import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LocatorResolution } from '../../core/models/inventory.models';
import { environment } from '../../../environments/environment';
import { PublicService } from '../../core/services/public.service';

@Component({
  selector: 'app-public-view',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './public-view.component.html',
  styleUrls: ['./public-view.component.scss']
})
export class PublicViewComponent {
  private readonly publicService = inject(PublicService);
  private readonly route = inject(ActivatedRoute);

  readonly resolution = signal<LocatorResolution | null>(null);
  readonly error = signal<string | null>(null);
  readonly showWarning = signal(environment.enablePublicEditWarnings);

  constructor() {
    const token = this.route.snapshot.paramMap.get('token') ?? '';
    this.publicService.getPublicLocator(token).subscribe({
      next: (data) => this.resolution.set(data),
      error: () => this.error.set('El token no es válido o expiró.')
    });
  }
}

import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="loading-state" [attr.aria-label]="label" role="status">
      <mat-spinner diameter="40"></mat-spinner>
      <span>{{ label }}</span>
    </div>
  `,
  styles: [
    `
      .loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        padding: 2rem;
        color: var(--app-muted-text);
      }
    `
  ]
})
export class LoadingStateComponent {
  @Input() label = 'Cargando...';
}

import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="empty-state">
      <mat-icon aria-hidden="true">{{ icon }}</mat-icon>
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
    </div>
  `,
  styles: [
    `
      .empty-state {
        text-align: center;
        padding: 2rem;
        color: var(--app-muted-text);
      }

      mat-icon {
        font-size: 3rem;
        height: 3rem;
        width: 3rem;
        margin-bottom: 0.5rem;
      }
    `
  ]
})
export class EmptyStateComponent {
  @Input() title = 'Sin contenido';
  @Input() message = 'Todavía no hay información para mostrar.';
  @Input() icon = 'inventory_2';
}

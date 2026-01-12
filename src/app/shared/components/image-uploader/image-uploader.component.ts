import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="uploader" (drop)="onDrop($event)" (dragover)="onDragOver($event)">
      <mat-icon aria-hidden="true">cloud_upload</mat-icon>
      <p>{{ label }}</p>
      <button mat-stroked-button type="button" (click)="fileInput.click()">Seleccionar</button>
      <input
        type="file"
        accept="image/*"
        hidden
        #fileInput
        (change)="onFileSelected($event)"
      />
    </div>
  `,
  styles: [
    `
      .uploader {
        border: 2px dashed var(--app-border);
        border-radius: 16px;
        padding: 1.5rem;
        text-align: center;
        display: grid;
        gap: 0.75rem;
        color: var(--app-muted-text);
        background: var(--app-surface);
      }
    `
  ]
})
export class ImageUploaderComponent {
  @Input() label = 'Arrastra una foto o selecciónala desde tu equipo';
  @Output() fileSelected = new EventEmitter<File>();

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.fileSelected.emit(file);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.fileSelected.emit(file);
    }
  }
}

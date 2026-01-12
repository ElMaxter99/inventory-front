import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-tag-chips',
  standalone: true,
  imports: [CommonModule, MatChipsModule],
  template: `
    <mat-chip-set>
      <mat-chip *ngFor="let tag of tags" color="primary" selected>{{ tag }}</mat-chip>
    </mat-chip-set>
  `
})
export class TagChipsComponent {
  @Input() tags: string[] = [];
}

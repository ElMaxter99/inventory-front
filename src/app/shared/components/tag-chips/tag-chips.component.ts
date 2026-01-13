import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-tag-chips',
  standalone: true,
  imports: [CommonModule, MatChipsModule],
  templateUrl: './tag-chips.component.html'
})
export class TagChipsComponent {
  @Input() tags: string[] = [];
}

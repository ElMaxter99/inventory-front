import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { ItemService } from '../../../../core/services/item.service';
import { ImageUploaderComponent } from '../../../../shared/components/image-uploader/image-uploader.component';
import { Item, ItemAttribute, ItemComment } from '../../../../core/models/inventory.models';

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatDividerModule,
    ImageUploaderComponent
  ],
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent {
  private readonly itemService = inject(ItemService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);

  readonly inventoryId = this.route.snapshot.paramMap.get('inventoryId') ?? '';
  readonly itemId = this.route.snapshot.paramMap.get('itemId') ?? '';

  readonly item = signal<Item | null>(null);
  readonly comments = signal<ItemComment[]>([]);
  readonly suggestion = signal<string>('');

  newComment = '';

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    description: [''],
    quantity: [1, [Validators.required, Validators.min(1)]],
    attributes: this.fb.array<FormGroup<{ key: FormControl<string>; value: FormControl<string> }>>(
      []
    )
  });

  constructor() {
    this.loadItem();
  }

  get attributes(): FormArray<FormGroup<{ key: FormControl<string>; value: FormControl<string> }>> {
    return this.form.get('attributes') as FormArray<
      FormGroup<{ key: FormControl<string>; value: FormControl<string> }>
    >;
  }

  loadItem(): void {
    this.itemService
      .getById(this.inventoryId, this.itemId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((item) => {
        this.item.set(item);
        this.form.patchValue({
          name: item.name,
          description: item.description ?? '',
          quantity: item.quantity
        });
        this.attributes.clear();
        item.attributes.forEach((attr) => {
          this.attributes.push(
            this.fb.nonNullable.group({ key: [attr.key], value: [attr.value] })
          );
        });
      });

    this.itemService
      .listComments(this.inventoryId, this.itemId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((comments) => this.comments.set(comments));
  }

  addAttribute(): void {
    this.attributes.push(this.fb.nonNullable.group({ key: [''], value: [''] }));
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }
    const payload = this.form.getRawValue();
    const attributes: ItemAttribute[] = payload.attributes.map((attr) => ({
      key: attr.key,
      value: attr.value
    }));
    this.itemService
      .update(this.inventoryId, this.itemId, { ...payload, attributes })
      .subscribe((item) => {
        this.item.set(item);
      });
  }

  uploadPhoto(file: File): void {
    this.itemService.uploadPhoto(this.inventoryId, this.itemId, file).subscribe((item) => {
      this.item.set(item);
    });
  }

  addComment(): void {
    if (!this.newComment) {
      return;
    }
    this.itemService.addComment(this.inventoryId, this.itemId, this.newComment).subscribe((comment) => {
      this.comments.set([comment, ...this.comments()]);
      this.newComment = '';
    });
  }

  requestSuggestion(): void {
    this.itemService.aiSuggest(this.inventoryId, this.itemId).subscribe((result) => {
      this.suggestion.set(result.suggestion);
    });
  }
}

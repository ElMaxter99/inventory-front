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
  template: `
    <section class="item-detail" *ngIf="item() as current">
      <mat-card>
        <mat-card-title>{{ current.name }}</mat-card-title>
        <mat-card-content>
          <div class="gallery">
            <img *ngFor="let photo of current.photos" [src]="photo" [alt]="current.name" />
          </div>
          <app-image-uploader (fileSelected)="uploadPhoto($event)"></app-image-uploader>
        </mat-card-content>
      </mat-card>

      <form [formGroup]="form" class="detail-form">
        <mat-card>
          <mat-card-title>Detalles</mat-card-title>
          <mat-card-content>
            <mat-form-field appearance="outline">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="name" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Descripción</mat-label>
              <textarea matInput rows="3" formControlName="description"></textarea>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Cantidad</mat-label>
              <input matInput type="number" formControlName="quantity" />
            </mat-form-field>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-title>Atributos</mat-card-title>
          <mat-card-content>
            <div formArrayName="attributes" class="attributes">
              <div *ngFor="let attribute of attributes.controls; let i = index" [formGroupName]="i">
                <mat-form-field appearance="outline">
                  <mat-label>Clave</mat-label>
                  <input matInput formControlName="key" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Valor</mat-label>
                  <input matInput formControlName="value" />
                </mat-form-field>
              </div>
            </div>
            <button mat-stroked-button type="button" (click)="addAttribute()">
              Añadir atributo
            </button>
          </mat-card-content>
        </mat-card>

        <button mat-flat-button color="primary" type="button" (click)="save()">
          Guardar cambios
        </button>
      </form>

      <mat-card>
        <mat-card-title>Comentarios</mat-card-title>
        <mat-card-content>
          <div class="comment" *ngFor="let comment of comments()">
            <strong>{{ comment.author.name }}</strong>
            <p>{{ comment.message }}</p>
          </div>
          <mat-divider></mat-divider>
          <mat-form-field appearance="outline" class="comment-box">
            <mat-label>Nuevo comentario</mat-label>
            <textarea matInput rows="2" [(ngModel)]="newComment"></textarea>
          </mat-form-field>
          <button mat-flat-button color="primary" (click)="addComment()">Enviar</button>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-title>IA sugerir</mat-card-title>
        <mat-card-content>
          <p>{{ suggestion() || 'Sin sugerencias aún' }}</p>
          <button mat-stroked-button (click)="requestSuggestion()">Solicitar</button>
        </mat-card-content>
      </mat-card>
    </section>
  `,
  styles: [
    `
      .item-detail {
        display: grid;
        gap: 1.5rem;
      }

      .gallery {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-bottom: 1rem;
      }

      .gallery img {
        width: 120px;
        height: 120px;
        object-fit: cover;
        border-radius: 12px;
      }

      .detail-form {
        display: grid;
        gap: 1rem;
      }

      .attributes {
        display: grid;
        gap: 0.75rem;
      }

      .comment {
        margin-bottom: 0.75rem;
      }

      .comment-box {
        width: 100%;
      }
    `
  ]
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

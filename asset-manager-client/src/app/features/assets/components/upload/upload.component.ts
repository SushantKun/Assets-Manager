import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AssetService } from '../../../../core/services/asset.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule
  ],
  template: `
    <div class="upload-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Upload Asset</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="uploadForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" required>
              <mat-error *ngIf="uploadForm.get('title')?.errors?.['required']">
                Title is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="4"></textarea>
            </mat-form-field>

            <div class="file-upload">
              <input type="file" #fileInput (change)="onFileSelected($event)" accept="image/*" style="display: none">
              <button type="button" mat-stroked-button (click)="fileInput.click()">
                <mat-icon>cloud_upload</mat-icon>
                Select File
              </button>
              <span *ngIf="selectedFile" class="file-name">{{ selectedFile.name }}</span>
              <mat-error *ngIf="!selectedFile && isSubmitted">
                Please select a file
              </mat-error>
            </div>

            <mat-progress-bar *ngIf="uploading" mode="indeterminate"></mat-progress-bar>

            <div class="actions">
              <button mat-button type="button" (click)="cancel()" [disabled]="uploading">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="uploadForm.invalid || uploading">
                {{ uploading ? 'Uploading...' : 'Upload' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .upload-container {
      padding: 24px;
      max-width: 600px;
      margin: 0 auto;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    mat-form-field {
      width: 100%;
    }
    .file-upload {
      margin: 16px 0;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .file-name {
      color: rgba(0, 0, 0, 0.6);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
    }
    mat-progress-bar {
      margin-top: 16px;
    }
  `]
})
export class UploadComponent {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  isSubmitted = false;
  uploading = false;

  constructor(
    private fb: FormBuilder,
    private assetService: AssetService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      description: ['']
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      // Auto-fill title if empty
      if (!this.uploadForm.get('title')?.value) {
        const fileName = this.selectedFile.name.replace(/\.[^/.]+$/, ''); // Remove extension
        this.uploadForm.patchValue({ title: fileName });
      }
    }
  }

  onSubmit(): void {
    this.isSubmitted = true;
    
    if (this.uploadForm.valid && this.selectedFile) {
      this.uploading = true;
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('name', this.uploadForm.get('title')?.value);
      formData.append('description', this.uploadForm.get('description')?.value || '');

      this.assetService.createAsset(formData).subscribe({
        next: (response) => {
          this.uploading = false;
          if (response.success) {
            this.snackBar.open('Asset uploaded successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/dashboard']);
          } else {
            this.snackBar.open(response.message || 'Upload failed', 'Close', { duration: 3000 });
          }
        },
        error: (error) => {
          this.uploading = false;
          console.error('Upload error:', error);
          this.snackBar.open(error.message || 'Upload failed', 'Close', { duration: 3000 });
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
} 
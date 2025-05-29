import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssetService } from '../../../../core/services/asset.service';

@Component({
    selector: 'app-asset-upload',
    templateUrl: './asset-upload.component.html',
    styleUrls: ['./asset-upload.component.scss']
})
export class AssetUploadComponent {
    uploadForm: FormGroup;
    selectedFile: File | null = null;
    loading = false;

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
        }
    }

    onSubmit(): void {
        if (this.uploadForm.valid && this.selectedFile) {
            this.loading = true;
            
            const formData = new FormData();
            formData.append('file', this.selectedFile);
            formData.append('title', this.uploadForm.get('title')?.value);
            formData.append('description', this.uploadForm.get('description')?.value);

            this.assetService.uploadAsset(formData)
                .subscribe({
                    next: (response) => {
                        this.snackBar.open('Asset uploaded successfully', 'Close', { duration: 3000 });
                        this.router.navigate(['/assets']);
                    },
                    error: (error) => {
                        this.snackBar.open('Error uploading asset', 'Close', { duration: 3000 });
                        this.loading = false;
                    }
                });
        }
    }
} 
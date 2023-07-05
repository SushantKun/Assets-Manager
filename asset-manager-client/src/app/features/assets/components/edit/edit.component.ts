import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetService, Asset } from '../../../../core/services/asset.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-asset-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EditAssetComponent implements OnInit {
  asset: Asset | null = null;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  editedAsset = {
    name: '',
    description: '',
    category: ''
  };

  constructor(
    private assetService: AssetService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAsset();
  }

  private loadAsset(): void {
    const assetId = Number(this.route.snapshot.paramMap.get('id'));
    if (!assetId) {
      this.error = 'Invalid asset ID';
      return;
    }

    this.loading = true;
    this.assetService.getAssetById(assetId).subscribe({
      next: (asset) => {
        this.asset = asset;
        this.editedAsset = {
          name: asset.name,
          description: asset.description || '',
          category: asset.category?.name || ''
        };
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.error = 'Failed to load asset';
        this.loading = false;
        console.error('Error loading asset:', error);
      }
    });
  }

  onSubmit(): void {
    if (!this.asset) return;

    this.loading = true;
    this.error = null;
    this.success = null;

    const formData = new FormData();
    formData.append('name', this.editedAsset.name);
    formData.append('description', this.editedAsset.description);
    if (this.editedAsset.category) {
      formData.append('category', this.editedAsset.category);
    }

    this.assetService.updateAsset(this.asset.id, formData).subscribe({
      next: (updatedAsset) => {
        this.success = 'Asset updated successfully';
        this.loading = false;
        // Navigate back to profile after a short delay
        setTimeout(() => {
          this.router.navigate(['/profile']);
        }, 1500);
      },
      error: (error: HttpErrorResponse) => {
        this.error = 'Failed to update asset';
        this.loading = false;
        console.error('Error updating asset:', error);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/profile']);
  }
} 
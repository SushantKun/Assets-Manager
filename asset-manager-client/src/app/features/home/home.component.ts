import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AssetService, Asset } from '../../core/services/asset.service';
import { AuthService } from '../../core/services/auth.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressBarModule
  ],
  template: `
    <div class="home-container">
      <!-- Header with Search -->
      <div class="header">
        <div class="branding">
          <h1>Asset Manager</h1>
          <p class="subtitle">Manage and share your digital assets</p>
        </div>
        <div class="search-container">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search assets or start creating</mat-label>
            <input matInput [(ngModel)]="searchQuery" (ngModelChange)="filterAssets()">
            <button mat-icon-button matSuffix>
              <mat-icon>search</mat-icon>
            </button>
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="uploadAsset()">
            <mat-icon>upload</mat-icon>
            Upload Asset
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters">
        <mat-form-field appearance="outline">
          <mat-label>Sort by</mat-label>
          <mat-select [(ngModel)]="sortBy" (selectionChange)="filterAssets()">
            <mat-option value="date">Date</mat-option>
            <mat-option value="name">Name</mat-option>
            <mat-option value="size">Size</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Filter by type</mat-label>
          <mat-select [(ngModel)]="fileType" (selectionChange)="filterAssets()">
            <mat-option value="all">All</mat-option>
            <mat-option value="image">Images</mat-option>
            <mat-option value="document">Documents</mat-option>
            <mat-option value="other">Others</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading">
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
        <p>Loading assets...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="error">
        {{ error }}
      </div>

      <!-- Assets Grid -->
      <div class="assets-grid" *ngIf="!loading && !error">
        <mat-card class="asset-card" *ngFor="let asset of filteredAssets">
          <div class="asset-preview" [ngStyle]="{'background-image': 'url(' + asset.imageUrl + ')'}">
            <div class="asset-actions">
              <button mat-icon-button color="primary" (click)="downloadAsset(asset)" matTooltip="Download">
                <mat-icon>download</mat-icon>
              </button>
              <button mat-icon-button color="accent" *ngIf="isOwner(asset)" (click)="editAsset(asset)" matTooltip="Edit">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" *ngIf="isOwner(asset)" (click)="deleteAsset(asset)" matTooltip="Delete">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>
          <mat-card-content>
            <h3>{{asset.name}}</h3>
            <p>{{asset.description}}</p>
            <p class="owner" *ngIf="asset.owner">By {{asset.owner.username}}</p>
            <div class="asset-meta">
              <span class="file-type">{{getFileType(asset)}}</span>
              <span class="file-size">{{formatFileSize(asset.size)}}</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && !error && filteredAssets.length === 0" class="empty-state">
        <mat-icon>cloud_upload</mat-icon>
        <h2>No assets found</h2>
        <p *ngIf="searchQuery">Try adjusting your search or filters</p>
        <p *ngIf="!searchQuery">Upload some assets to get started!</p>
        <button mat-raised-button color="primary" (click)="uploadAsset()">
          Upload Asset
        </button>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 32px;
    }

    .branding {
      margin-bottom: 24px;
    }

    .branding h1 {
      margin: 0;
      font-size: 32px;
      font-weight: 500;
    }

    .subtitle {
      margin: 8px 0 0;
      color: rgba(0, 0, 0, 0.6);
    }

    .search-container {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .search-field {
      flex: 1;
    }

    .filters {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
    }

    .assets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
      margin-top: 24px;
    }

    .asset-card {
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.2s;
    }

    .asset-card:hover {
      transform: translateY(-4px);
    }

    .asset-preview {
      height: 200px;
      background-size: cover;
      background-position: center;
      position: relative;
    }

    .asset-actions {
      position: absolute;
      top: 0;
      right: 0;
      padding: 8px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 0 0 0 8px;
      display: none;
    }

    .asset-preview:hover .asset-actions {
      display: flex;
      gap: 8px;
    }

    mat-card-content {
      padding: 16px;
    }

    mat-card-content h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 500;
    }

    mat-card-content p {
      margin: 8px 0 0;
      color: rgba(0, 0, 0, 0.6);
    }

    .owner {
      font-size: 0.9em;
      color: rgba(0, 0, 0, 0.5);
    }

    .asset-meta {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
      font-size: 0.85em;
      color: rgba(0, 0, 0, 0.5);
    }

    .empty-state {
      text-align: center;
      padding: 48px;
      background: #f5f5f5;
      border-radius: 8px;
    }

    .empty-state mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      color: rgba(0, 0, 0, 0.3);
      margin-bottom: 16px;
    }

    .empty-state h2 {
      margin: 0;
      font-weight: 500;
    }

    .empty-state p {
      margin: 8px 0 24px;
      color: rgba(0, 0, 0, 0.6);
    }

    .loading {
      text-align: center;
      padding: 48px;
    }

    .loading p {
      margin-top: 16px;
      color: rgba(0, 0, 0, 0.6);
    }

    .error {
      text-align: center;
      padding: 48px;
      color: #f44336;
    }
  `]
})
export class HomeComponent implements OnInit {
  assets: Asset[] = [];
  filteredAssets: Asset[] = [];
  loading = true;
  error: string | null = null;
  currentUserId: number | null = null;

  // Search and filter state
  searchQuery = '';
  sortBy = 'date';
  fileType = 'all';

  constructor(
    private assetService: AssetService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUserId = user?.id || null;
    });
  }

  ngOnInit(): void {
    this.loadAssets();
  }

  loadAssets(): void {
    this.loading = true;
    this.error = null;
    
    this.assetService.getAllAssets().subscribe({
      next: (assets) => {
        this.assets = assets;
        this.filterAssets();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading assets:', error);
        this.error = 'Failed to load assets. Please try again later.';
        this.loading = false;
      }
    });
  }

  filterAssets(): void {
    let filtered = [...this.assets];

    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(asset => 
        asset.name.toLowerCase().includes(query) ||
        asset.description?.toLowerCase().includes(query) ||
        asset.owner?.username.toLowerCase().includes(query)
      );
    }

    // Apply file type filter
    if (this.fileType !== 'all') {
      filtered = filtered.filter(asset => this.getFileType(asset).toLowerCase() === this.fileType);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return (b.size || 0) - (a.size || 0);
        case 'date':
        default:
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
    });

    this.filteredAssets = filtered;
  }

  getFileType(asset: Asset): string {
    if (!asset.mime_type) return 'Other';
    if (asset.mime_type.startsWith('image/')) return 'Image';
    if (asset.mime_type.includes('pdf')) return 'PDF';
    if (asset.mime_type.includes('document')) return 'Document';
    return 'Other';
  }

  formatFileSize(bytes: number | undefined): string {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  }

  isOwner(asset: Asset): boolean {
    return this.currentUserId != null && asset.owner?.id === this.currentUserId;
  }

  uploadAsset(): void {
    this.router.navigate(['/assets/upload']);
  }

  downloadAsset(asset: Asset): void {
    this.assetService.downloadAsset(asset.id).subscribe({
      next: (blob) => {
        const fileName = asset.imageUrl.split('/').pop() || 'asset';
        saveAs(blob, fileName);
        this.snackBar.open('Download started', 'Close', { duration: 2000 });
      },
      error: (error) => {
        console.error('Error downloading asset:', error);
        this.snackBar.open('Error downloading asset', 'Close', { duration: 3000 });
      }
    });
  }

  editAsset(asset: Asset): void {
    this.router.navigate(['/assets/edit', asset.id]);
  }

  deleteAsset(asset: Asset): void {
    if (confirm('Are you sure you want to delete this asset?')) {
      this.assetService.deleteAsset(asset.id).subscribe({
        next: () => {
          this.snackBar.open('Asset deleted successfully', 'Close', { duration: 3000 });
          this.loadAssets();
        },
        error: (error) => {
          console.error('Error deleting asset:', error);
          this.snackBar.open('Error deleting asset', 'Close', { duration: 3000 });
        }
      });
    }
  }
} 
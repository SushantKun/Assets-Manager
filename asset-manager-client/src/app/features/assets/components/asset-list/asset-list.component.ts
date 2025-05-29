import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { AssetService, Asset } from '../../../../services/asset.service';

@Component({
    selector: 'app-asset-list',
    standalone: true,
    imports: [CommonModule, MatCardModule],
    template: `
        <div class="container">
            <mat-card>
                <mat-card-header>
                    <mat-card-title>Asset List</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                    <div *ngIf="loading" class="loading">
                        Loading assets...
                    </div>
                    <div *ngIf="error" class="error">
                        {{ error }}
                    </div>
                    <div *ngIf="!loading && !error">
                        <div *ngIf="assets.length === 0" class="no-assets">
                            No assets found.
                        </div>
                        <div *ngIf="assets.length > 0" class="asset-grid">
                            <div *ngFor="let asset of assets" class="asset-card">
                                <h3>{{ asset.name }}</h3>
                                <p>{{ asset.description }}</p>
                                <p>Serial: {{ asset.serialNumber }}</p>
                                <p>Location: {{ asset.location || 'N/A' }}</p>
                                <p>Purchase Price: {{ asset.purchasePrice | currency }}</p>
                                <p>Purchase Date: {{ asset.purchaseDate | date }}</p>
                            </div>
                        </div>
                    </div>
                </mat-card-content>
            </mat-card>
        </div>
    `,
    styles: [`
        .container {
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        .loading, .error, .no-assets {
            text-align: center;
            padding: 20px;
        }
        .error {
            color: red;
        }
        .asset-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            padding: 20px;
        }
        .asset-card {
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: #f9f9f9;
        }
        .asset-card h3 {
            margin-top: 0;
            color: #333;
        }
    `]
})
export class AssetListComponent implements OnInit {
    assets: Asset[] = [];
    loading = true;
    error = '';

    constructor(private assetService: AssetService) {}

    ngOnInit() {
        this.loadAssets();
    }

    private loadAssets() {
        this.assetService.getAssets().subscribe({
            next: (assets) => {
                this.assets = assets;
                this.loading = false;
            },
            error: (error) => {
                this.error = 'Error loading assets. Please try again later.';
                this.loading = false;
                console.error('Error loading assets:', error);
            }
        });
    }
}
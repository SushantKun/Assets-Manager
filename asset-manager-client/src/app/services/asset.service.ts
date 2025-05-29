import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Asset {
    id: number;
    name: string;
    description: string;
    serialNumber: string;
    purchasePrice: number;
    purchaseDate: Date;
    location: string;
    imageUrl: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

@Injectable({
    providedIn: 'root'
})
export class AssetService {
    private apiUrl = 'http://localhost:3000/api/assets';

    constructor(private http: HttpClient) {}

    getAssets(): Observable<Asset[]> {
        return this.http.get<Asset[]>(this.apiUrl);
    }

    getAsset(id: number): Observable<Asset> {
        return this.http.get<Asset>(`${this.apiUrl}/${id}`);
    }

    createAsset(asset: Partial<Asset>): Observable<Asset> {
        return this.http.post<Asset>(this.apiUrl, asset);
    }

    updateAsset(id: number, asset: Partial<Asset>): Observable<Asset> {
        return this.http.put<Asset>(`${this.apiUrl}/${id}`, asset);
    }

    deleteAsset(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
} 
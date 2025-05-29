import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Asset {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  file_path?: string;
  file_type?: string;
  mime_type?: string;
  size?: number;
  owner?: {
    id: number;
    username: string;
  };
  category?: {
    id: number;
    name: string;
  };
  tags?: any[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AssetResponse {
  assets: Asset[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AssetUploadResponse {
  success: boolean;
  asset: Asset;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private apiUrl = `${environment.apiUrl}/api/assets`;

  constructor(private http: HttpClient) {}

  getAllAssets(): Observable<Asset[]> {
    return this.http.get<AssetResponse>(this.apiUrl).pipe(
      map(response => {
        if (response && Array.isArray(response.assets)) {
          return response.assets;
        }
        return [];
      }),
      catchError(this.handleError)
    );
  }

  getUserAssets(): Observable<Asset[]> {
    return this.http.get<Asset[]>(`${this.apiUrl}/user`).pipe(
      map(response => {
        // If response is an array, return it, otherwise return empty array
        return Array.isArray(response) ? response : [];
      }),
      catchError(error => {
        console.error('Error fetching user assets:', error);
        // Return empty array on error so the UI can show the "no assets" message
        return of([]);
      })
    );
  }

  getAssetById(id: number): Observable<Asset> {
    return this.http.get<Asset>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createAsset(formData: FormData): Observable<AssetUploadResponse> {
    return this.http.post<AssetUploadResponse>(this.apiUrl, formData).pipe(
      catchError(this.handleError)
    );
  }

  updateAsset(id: number, formData: FormData): Observable<Asset> {
    return this.http.put<Asset>(`${this.apiUrl}/${id}`, formData).pipe(
      catchError(this.handleError)
    );
  }

  deleteAsset(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  downloadAsset(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download`, {
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Helper method to format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else if (error.error instanceof Blob) {
      errorMessage = 'Error downloading file';
    } else {
      try {
        const errorBody = typeof error.error === 'string' ? JSON.parse(error.error) : error.error;
        errorMessage = errorBody?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
      } catch (e) {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.statusText}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
} 
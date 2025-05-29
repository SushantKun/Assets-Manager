export interface Asset {
    id: number;
    title: string;
    description: string | null;
    file_type: string;
    file_path: string;
    mime_type: string;
    size: number;
    upload_date: Date;
    user: {
        id: number;
        username: string;
    };
    categories?: {
        id: number;
        name: string;
    }[];
    tags?: {
        id: number;
        name: string;
    }[];
}

export interface AssetResponse {
    message: string;
    asset: Asset;
}

export interface AssetsResponse {
    assets: Asset[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
} 
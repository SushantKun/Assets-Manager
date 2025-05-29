declare namespace Express {
    export interface Request {
        user?: {
            userId: number;
            username: string;
        };
        file?: {
            filename: string;
            path: string;
            mimetype: string;
            size: number;
        };
    }
} 
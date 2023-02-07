export interface AuthAttempt {
    id?: string;
    ip: string;
    url: string;
    timestamp: number;
    denied: boolean;
}

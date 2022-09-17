export interface Video {
    id: number;
    title: string;
    author: string;
    canBeDownloaded?: boolean;
    minAgeRestriction?: number | null;
    createdAt?: Date;
    publicationDate?: Date;
    availableResolutions?: string[];
}

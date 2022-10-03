export interface Video {
    id?: string;
    title: string;
    author: string;
    canBeDownloaded?: boolean;
    minAgeRestriction?: number | null;
    createdAt?: Date;
    publicationDate?: Date;
    availableResolutions?: string[];
}

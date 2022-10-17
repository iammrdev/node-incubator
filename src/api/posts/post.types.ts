export interface Post {
    id?: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName?: string;
    createdAt?: Date;
}

export interface GetPostsByBlogIdParams {
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortDirection: 'asc' | 'desc'
}
import { LikeStatus } from '../comments/comment.repository';

export type LikeInfo = {
    addedAt: Date;
    login: string;
    userId: string;
};

export type ResLikeInfo = {
    addedAt: string;
    login: string;
    userId: string;
};

export interface Post {
    id?: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName?: string;
    createdAt?: Date;
    likedUsers?: LikeInfo[];
    dislikedUsers?: LikeInfo[];
}

export type PostResponseModel = {
    id?: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName?: string;
    createdAt?: Date;
    extendedLikesInfo: {
        dislikesCount: number;
        likesCount: number;
        myStatus: LikeStatus;
        newestLikes: ResLikeInfo[];
    };
};

export interface GetPostsByBlogIdParams {
    searchNameTerm?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy: string;
    sortDirection?: 'asc' | 'desc';
}

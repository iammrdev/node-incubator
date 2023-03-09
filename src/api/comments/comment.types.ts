import { ObjectId } from 'mongodb';
import { LikeStatus } from './comment.repository';

export interface Comment {
    _id?: ObjectId;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    postId: string;
    likedUsers?: string[];
    dislikedUsers?: string[];
    createdAt: Date;
}

export type CommentCreateModel = {
    postId: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    content: string;
    likedUsers?: string[];
    dislikedUsers?: string[];
};

export type CommentResponseModel = {
    id: string;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt: Date;
    likesInfo: {
        dislikesCount: number;
        likesCount: number;
        myStatus: LikeStatus;
    };
};

export interface GetCommentsByPostParams {
    searchNameTerm?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy: string;
    sortDirection?: 'asc' | 'desc';
}

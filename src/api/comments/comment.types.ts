import { ObjectId } from 'mongodb';

export interface Comment {
    _id?: ObjectId;
    content: string;
    userId: string;
    postId: string;
    createdAt: Date;
}

export type CommentCreateModel = {
    postId: string;
    userId: string;
    content: string;
};

export type CommentResponseModel = {
    id: string;
    content: string;
    userId: string;
    userLogin: string;
    createdAt: Date;
};

export interface GetCommentsByPostParams {
    searchNameTerm?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy: string;
    sortDirection?: 'asc' | 'desc'
}
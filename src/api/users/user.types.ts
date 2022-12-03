import { ObjectId } from 'mongodb';

export interface User {
    _id?: ObjectId;
    login: string;
    hash: string;
    salt: string;
    email: string;
    confirmation: {
        status: boolean;
        code: string;
        expiration: Date
        activation: Date | null
    }
    createdAt: Date;
    updatedAt: Date;
}

export type UserRepostoryCreateModel = {
    login: string;
    hash: string;
    salt: string;
    email: string;
};

export type UserCreateModel = {
    login: string;
    password: string;
    email: string;
};

export type UserResponseModel = {
    id: string;
    login: string;
    email: string;
    createdAt: Date;
};

export interface GetUsersParams {
    searchLoginTerm?: string;
    searchEmailTerm?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy: string;
    sortDirection?: 'asc' | 'desc';
}

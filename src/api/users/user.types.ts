import { ObjectId } from 'mongodb';

export interface User {
    _id?: ObjectId;
    login: string;
    hash: string;
    salt: string;
    email: string;
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
    _id: ObjectId;
    login: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
};

export interface GetUsersParams {
    searchNameTerm?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy: string;
    sortDirection?: 'asc' | 'desc';
}

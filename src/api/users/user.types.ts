import { ObjectId } from 'mongodb';

export interface User {
    _id?: ObjectId;
    login: string;
    password: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export type UserCreateModel = Pick<User, 'login' | 'password' | 'email'>;

export type UserResponseModel = Omit<User, 'password'>;

export interface GetUsersParams {
    searchNameTerm?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy: string;
    sortDirection?: 'asc' | 'desc';
}

import { UserRepository } from './user.repository.js';
import { GetUsersParams, UserCreateModel } from './user.types.js';

const createUser = async (data: Omit<UserCreateModel, 'id'>) => {
    return UserRepository.createUser(data);
};

const getUsers = async (params: GetUsersParams) => {
    return UserRepository.getAll(params);
};

const deleteUser = async (id: string) => {
    return UserRepository.deleteUser(id);
};

export const UserService = {
    getUsers,
    createUser,
    deleteUser,
};

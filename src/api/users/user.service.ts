import bcrypt from 'bcrypt';
import { UserRepository } from './user.repository.js';
import { GetUsersParams, UserCreateModel } from './user.types.js';

const generateHash = async (password: string, salt: string) => {
    const hash = await bcrypt.hash(password, salt);

    return hash;
};

const checkCredentials = async (login: string, password: string) => {
    const user = await UserRepository.getUserByLogin(login);

    if (!user) {
        return false;
    }

    const hash = await generateHash(password, user.salt);

    if (user.hash !== hash) {
        return false;
    }

    return true;
};

const createUser = async ({ login, password, email }: Omit<UserCreateModel, 'id'>) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await generateHash(password, salt);

    return UserRepository.createUser({ login, email, salt, hash });
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
    checkCredentials
};

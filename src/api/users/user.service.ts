import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { UserRepository } from './user.repository';
import { GetUsersParams, UserCreateModel } from './user.types';

const generateHash = async (password: string, salt: string) => {
    const hash = await bcrypt.hash(password, salt);

    return hash;
};

const checkCredentials = async (loginOrEmail: string, password: string) => {
    const user = await UserRepository.getUserByLoginOrEmail(loginOrEmail);

    if (!user) {
        return null;
    }

    const hash = await generateHash(password, user.salt);

    if (user.hash !== hash) {
        return null;
    }

    return user;
};

const createJWT = (userId: string, options: { expiresIn: string }) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: options.expiresIn });

    return token;
};

const getUserIdByToken = (token: string) => {
    try {
        const result = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        return new ObjectId(result.userId);
    } catch (error) {
        return null;
    }
};

const createUser = async ({ login, password, email }: Omit<UserCreateModel, 'id'>) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await generateHash(password, salt);

    return UserRepository.createUser({ login, email, salt, hash });
};

const getUsers = async (params: GetUsersParams) => {
    return UserRepository.getAll(params);
};

const getUser = async (userId: string) => {
    return UserRepository.getUser(userId);
};

const deleteUser = async (id: string) => {
    return UserRepository.deleteUser(id);
};

export const UserService = {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    checkCredentials,
    createJWT,
    getUserIdByToken,
};

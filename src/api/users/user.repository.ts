import { ObjectId } from 'mongodb';
import { usersCollection } from '../../lib/db/index.js';

import { GetUsersParams, User, UserRepostoryCreateModel, UserResponseModel } from './user.types.js';

const createUserDto = (user: Required<User>): UserResponseModel => {
    return {
        _id: user._id,
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};

export class UserRepository {
    static async createUser(data: UserRepostoryCreateModel) {
        const user = {
            login: data.login,
            hash: data.hash,
            salt: data.salt,
            email: data.email,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const item = await usersCollection.insertOne(user);

        return UserRepository.getUser(item.insertedId.toString());
    }

    static async getAll(params: GetUsersParams = { sortBy: 'createdAt' }) {
        const totalCount = await usersCollection.count({});
        const pageSize = params.pageSize || 10;
        const skip = params.pageNumber && pageSize ? (params.pageNumber - 1) * pageSize : 0;
        const users = await usersCollection.find({}).toArray();

        return {
            pagesCount: pageSize ? Math.ceil(totalCount / pageSize) : 1,
            page: params.pageNumber || 1,
            pageSize: pageSize || totalCount,
            totalCount,
            items: users
                .map((user) => createUserDto(user))
                .sort((user1, user2) => {
                    const sort = params.sortBy || ('createdAt' as keyof UserResponseModel);

                    if (params.sortDirection === 'asc') {
                        // @ts-ignore
                        if (user1[sort] > user2[sort]) {
                            return 1;
                            // @ts-ignore
                        } else if (user1[sort] < user2[sort]) {
                            return -1;
                        }

                        return 0;
                    }
                    // @ts-ignore
                    if (user2[sort] > user1[sort]) {
                        return 1;
                        // @ts-ignore
                    } else if (user2[sort] < user1[sort]) {
                        return -1;
                    }

                    return 0;
                })
                .slice(skip, skip + pageSize || totalCount),
        };
    }

    static async getUser(id: string) {
        const user = await usersCollection.findOne({ _id: new ObjectId(id) });

        if (!user) {
            return;
        }

        return createUserDto(user);
    }

    static async getUserByLogin(login: string) {
        const user = await usersCollection.findOne({ login });

        if (!user) {
            return;
        }

        return user;
    }

    static async deleteUser(id: string) {
        const user = await usersCollection.findOne({ _id: new ObjectId(id) });

        if (!user) {
            return;
        }

        await usersCollection.deleteOne({ _id: user._id });

        return { id };
    }
}

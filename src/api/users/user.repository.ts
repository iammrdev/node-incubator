import { ObjectId } from 'mongodb';
import { usersCollection } from '../../lib/db/index';

import { GetUsersParams, User, UserRepostoryCreateModel, UserResponseModel } from './user.types';

const createUserDto = (user: Required<User>): UserResponseModel => {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
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
        const totalCount = await usersCollection.count({
            $or: [
                { login: { $regex: params.searchLoginTerm || "", $options: '$i' } },
                { email: { $regex: params.searchEmailTerm || "", $options: '$i' } }
            ]
        });
        const pageSize = params.pageSize || 10;
        const skip = params.pageNumber && pageSize ? (params.pageNumber - 1) * pageSize : 0;
        const users = await usersCollection
            .find({
                $or: [
                    { login: { $regex: params.searchLoginTerm || "", $options: '$i' } },
                    { email: { $regex: params.searchEmailTerm || "", $options: '$i' } }
                ]
            })
            .toArray();

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

    static async getUserByLoginOrEmail(loginOrEmail: string) {
        const user = await usersCollection.findOne({
            $or: [
                { login: { $regex: loginOrEmail, $options: '$i' } },
                { email: { $regex: loginOrEmail, $options: '$i' } }
            ]
        });

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

    static async deleteAll() {
        await usersCollection.deleteMany({});

        return [];
    }
}

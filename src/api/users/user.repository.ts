import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
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
            confirmation: {
                status: false,
                code: uuidv4(),
                expiration: add(new Date(), { minutes: 60 }),
                activation: null,
            },
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const item = await usersCollection.insertOne(user);

        return UserRepository.getUser(item.insertedId.toString());
    }

    static async getAll(params: GetUsersParams = { sortBy: 'createdAt' }) {
        const totalCount = await usersCollection.count({
            $or: [
                { login: { $regex: params.searchLoginTerm || '', $options: '$i' } },
                { email: { $regex: params.searchEmailTerm || '', $options: '$i' } },
            ],
        });
        const pageSize = params.pageSize || 10;
        const skip = params.pageNumber && pageSize ? (params.pageNumber - 1) * pageSize : 0;
        const users = await usersCollection
            .find({
                $or: [
                    { login: { $regex: params.searchLoginTerm || '', $options: '$i' } },
                    { email: { $regex: params.searchEmailTerm || '', $options: '$i' } },
                ],
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
            return { user: undefined };
        }

        return { user: createUserDto(user), confirmation: user.confirmation };
    }

    static async getUserByLoginOrEmail(loginOrEmail: string) {
        const user = await usersCollection.findOne({
            $or: [
                { login: { $regex: loginOrEmail, $options: '$i' } },
                { email: { $regex: loginOrEmail, $options: '$i' } },
            ],
        });

        if (!user) {
            return;
        }

        return user;
    }

    static async getUserByConfirmationCode(code: string) {
        const user = await usersCollection.findOne({ 'confirmation.code': code });

        if (!user) {
            return;
        }

        return user;
    }

    static async updateUserConfirmation(id: string, confirmation: any) {
        const user = await usersCollection.findOne({ _id: new ObjectId(id) });

        if (!user) {
            return;
        }

        await usersCollection.updateOne(
            { _id: user._id },
            {
                $set: {
                    ...user,
                    confirmation,
                },
            },
        );

        return UserRepository.getUser(id);
    }

    static async updateUserPassword(id: string, hash: string, salt: string) {
        const user = await usersCollection.findOne({ _id: new ObjectId(id) });

        if (!user) {
            return;
        }

        await usersCollection.updateOne(
            { _id: user._id },
            {
                $set: {
                    ...user,
                    hash,
                    salt,
                },
            },
        );

        return UserRepository.getUser(id);
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

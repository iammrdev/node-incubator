import { ObjectId } from 'mongodb';
import { tokensCollection } from '../../lib/db/index';

export class AuthRepository {
    static async saveRefreshToken({ userId, refreshToken }: { userId: string; refreshToken: string }) {
        const token = {
            userId,
            token: refreshToken,
            createdAt: new Date(),
        };

        const item = await tokensCollection.insertOne(token);

        return AuthRepository.getTokenById(item.insertedId.toString());
    }

    static async getTokenById(id: string) {
        const token = await tokensCollection.findOne({ _id: new ObjectId(id) });

        return token;
    }

    static async getTokensByUser(userId: string) {
        const token = await tokensCollection.find({ userId });

        return token;
    }

    static async getTokenInfo(refreshToken: string) {
        const token = await tokensCollection.findOne({ token: refreshToken });

        return token;
    }

    static async deleteToken(refreshToken: string) {
        const token = await tokensCollection.findOne({ token: refreshToken });

        if (!token) {
            return;
        }

        await tokensCollection.deleteOne({ token: refreshToken });

        return { id: token._id };
    }

    static async deleteAll() {
        await tokensCollection.deleteMany({});

        return [];
    }
}

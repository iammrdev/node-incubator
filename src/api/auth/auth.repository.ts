import { ObjectId } from 'mongodb';
import { tokensCollection } from '../../lib/db/index';

export class AuthRepository {
    static async saveRefreshToken({
        ip,
        title,
        userId,
        deviceId,
        refreshToken,
        iat,
        exp,
    }: {
        ip: string;
        title: string;
        userId: string;
        deviceId: string;
        refreshToken: string;
        iat: number;
        exp: number;
    }) {
        const token = {
            ip,
            title,
            userId,
            deviceId,
            token: refreshToken,
            iat,
            exp,
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

    static async getTokens(userId: string) {
        const tokens = await tokensCollection.find({ userId });

        return tokens.toArray();
    }

    static async deleteToken(refreshToken: string) {
        const token = await tokensCollection.findOne({ token: refreshToken });

        if (!token) {
            return;
        }

        await tokensCollection.deleteOne({ token: refreshToken });

        return { id: token._id };
    }

    static async deleteByUser(userId: string, deviceId: string) {
        const token = await tokensCollection.findOne({ deviceId });

        if (!token) {
            return 404;
        }

        if (token.userId !== userId) {
            return 403;
        }

        await tokensCollection.deleteOne({ deviceId });

        return { id: token._id };
    }

    static async deleteAllByUser(userId: string, deviceId: string) {
        await tokensCollection.deleteMany({ $and: [{ userId }, { deviceId: { $ne: deviceId } }] });

        return true;
    }

    static async deleteAll() {
        await tokensCollection.deleteMany({});

        return [];
    }
}

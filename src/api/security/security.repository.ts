import { authAttemptsCollection } from '../../lib/db/index';
import { AuthAttempt } from './security.types';

export class SecurityRepository {
    static async saveAuthAttempt(attempt: AuthAttempt) {
        const result = await authAttemptsCollection.insertOne(attempt);

        return result;
    }

    static async getAttemptsByIp(ip: string, url: string, exp: number) {
        const attempts = await authAttemptsCollection.find({ ip, url, timestamp: { $gte: exp } });

        return attempts.toArray();
    }

    static async clearAttemptsByUser(ip: string, exp: number) {
        await authAttemptsCollection.deleteMany({ $and: [{ ip }, { timestamp: { $lt: exp } }] });

        return true;
    }
}

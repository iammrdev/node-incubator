import { v4 as uuidv4 } from 'uuid';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserService } from '../users/user.service';
import { AuthRepository } from './auth.repository';
import { UserLoginModel } from './auth.types';

const login = async ({ loginOrEmail, password, ip, title }: UserLoginModel) => {
    const user = await UserService.checkCredentials(loginOrEmail, password);

    if (!user) {
        return null;
    }

    const deviceId = uuidv4();

    const tokens = {
        accessToken: UserService.createJWT(user._id.toString(), { expiresIn: '10m' }),
        refreshToken: UserService.createJWT(user._id.toString(), { deviceId, expiresIn: '20m' }),
    };

    const refreshTokenPayload = jwt.decode(tokens.refreshToken) as JwtPayload;

    const result = await AuthRepository.saveRefreshToken({
        ip,
        title,
        userId: user._id.toString(),
        deviceId,
        iat: refreshTokenPayload.iat!,
        exp: refreshTokenPayload.exp!,
        refreshToken: tokens.refreshToken,
    });

    if (!result) {
        return;
    }

    return tokens;
};

export const AuthService = {
    login,
};

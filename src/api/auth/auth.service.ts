import { UserService } from '../users/user.service';
import { AuthRepository } from './auth.repository';
import { UserLoginModel } from './auth.types';

const login = async ({ loginOrEmail, password }: UserLoginModel) => {
    const user = await UserService.checkCredentials(loginOrEmail, password);

    if (!user) {
        return null;
    }

    const tokens = {
        accessToken: UserService.createJWT(user._id.toString(), { expiresIn: '10s' }),
        refreshToken: UserService.createJWT(user._id.toString(), { expiresIn: '20s' }),
    };

    const result = await AuthRepository.saveRefreshToken({
        userId: user._id.toString(),
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

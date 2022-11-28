import { UserService } from '../users/user.service';
import { UserLoginModel } from './auth.types';

const login = async ({ loginOrEmail, password }: UserLoginModel) => {
    const user = await UserService.checkCredentials(loginOrEmail, password);

    if (!user) {
        return null;
    }

    return UserService.createJWT(user._id.toString())
};

export const AuthService = {
    login,
};

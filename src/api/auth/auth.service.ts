import { UserService } from '../users/user.service.js';
import { UserLoginModel } from './auth.types.js';

const login = async ({ login, password }: UserLoginModel) => {
    return UserService.checkCredentials(login, password);
};

export const AuthService = {
    login,
};

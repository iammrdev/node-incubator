export type UserLoginModel = {
    loginOrEmail: string;
    password: string;
};

export type RefreshToken = {
    id?: string;
    userId: string;
    token: string;
    createdAt: Date;
};

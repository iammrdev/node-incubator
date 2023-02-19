export type UserLoginModel = {
    loginOrEmail: string;
    password: string;
    ip: string;
    title: string;
};

export type RefreshToken = {
    id?: string;
    userId: string;
    deviceId: string;
    title: string;
    ip: string;
    token: string;
    iat: number;
    exp: number;
};


export type RecoveryPassword = {
    id?: string;
    userId: string;
    deviceId: string;
    title: string;
    ip: string;
    code: string;
    iat: number;
    exp: number;
};

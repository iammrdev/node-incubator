import { UserResponseModel } from "./api/users/user.types";

declare global {
    declare namespace Express {
        export interface Request {
            user: UserResponseModel;
        }
    }
}
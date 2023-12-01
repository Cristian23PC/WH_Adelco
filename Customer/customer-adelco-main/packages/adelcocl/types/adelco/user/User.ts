import { Zone } from "./Zone";

export interface User extends Zone {
    loggedIn: boolean;
    isFirstTime?: boolean;
    tokenExpiredTime?: number;
    email?: string;
}
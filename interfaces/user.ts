
export interface IUser {
    _id      : string;
    name     : string;
    email    : string;
    password?: string;
    role     : string;
    sector   : string;

    createdAt?: string;
    updatedAt?: string;
}
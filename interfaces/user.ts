
export interface IUser {
    _id      : string;
    name     : string;
    email    : string;
    password?: string;
    role     : string;
    locations: string[];
    sector   : string;

    createdAt?: string;
    updatedAt?: string;
}
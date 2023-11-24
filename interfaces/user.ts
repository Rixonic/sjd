
export interface IUser {
    _id      : string;
    name     : string;
    email    : string;
    password?: string;
    role     : string;
    locations: string[];
    sede     : string[];
    sector   : string;

    createdAt?: string;
    updatedAt?: string;
}
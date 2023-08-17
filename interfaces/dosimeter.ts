
export interface IDosimeter {
    _id?        : string;           //propio de la base de datos   
    //ownId       : Number;
    month       : Number;
    year        : Number;
    headquarter : string;   
    service     : string;
    location    : string;
    document    : string;
    
    createdAt?: string;
    updatedAt?: string;
}

export interface ITicket {
    _id?        : string;           //propio de la base de datos       
    images      : string[];         //Imagenes asociadas
    ticketId    : string;           //Generado automaticamente
    location    : string;           //Generado automaticamente
    status      : string;           //En progreso o finalizado
    summary     : string;           //Resumen del ticket, para mostrar en tabla
    detail      : string;           //Detalle del ticket
    user        : string;           //Quien creo el ticket
    assignedTo  : string;           //Usuario asignado
    associatedEquipId: string; //Equipo asociado
    comment     : IComment[];       //Aca se cargan todos los comentarios, varios
    diagnostic  : IDiagonstic;      //Aca se cargan todos los comentarios
    createdAt?  : string;           //Fecha de creacion del ticket
    isTechnician: boolean;
    isSupervisor: boolean;
    isService   : boolean;
    
}

export interface IDiagonstic{
    _id : string;
    user : string;
    observation : string;
}

export interface IComment{
    _id : string;
    user : string;
    commentary: string;
    createAt? : string;
}



/*

//import { ISize, IUser } from './';

export interface ITicket {
    _id? : string;
    images : string[] ;
    ticketId : string;
    isCompleted : boolean;
    summary : string;
    detail : string;
    user : string;   //Usamos user?
    assignedTo : string; //Aca tambien?
    status : string ; //o bool?
    diagnostic : IDiagonstic;
    comment: IComment[];
    
    createdAt?: string;

}

export interface IDiagonstic{
    _id : string;
    user : string;
    observation : string;
}

export interface IComment{
    _id : string;
    user : string;
    commentary: string;
    createAt? : string;
}

*/
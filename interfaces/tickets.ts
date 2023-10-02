
export interface ITicket {
    _id?: string;
    images: string[];
    ticketId: string;
    location: string;
    status: string;
    summary: string;
    detail: string;
    user: string;
    assignedTo: string;
    equipId: string;
    type: string;
    sector: string;
    priority: string;
    comments: {
        user : string;
        comment: string;
        createdAt : Date;
    }[]
    ; // Cambia aquí para usar el tipo de IComment
    diagnostic: IDiagonstic;
    createdAt?: string;
    finishAt: Date;
    finishBy: string;
    estimatedFinish: Date;
    isTechnician: boolean;
    isSupervisor: boolean;
    isService: boolean;
  }

export interface IDiagonstic{
    user : string;
    observation : string;
}

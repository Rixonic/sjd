
export interface IEquipmentService {
    _id?        : string;           //propio de la base de datos       
    equip       : string;
    brand       : string;
    model       : string;
    serialNumber: string;
    service     : string;
    perfomance  : Date;
    duePerfomance: Date;
    electricalSecurity: Date;
    dueElectricalSecurity: Date;
    
    createdAt?: string;
    updatedAt?: string;
}
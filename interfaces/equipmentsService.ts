
export interface IEquipmentService {
    _id?        : string;           //propio de la base de datos    
    ownId       : Number;
    ecri        : string;   
    equip       : string;
    brand       : string;
    model       : string;
    serialNumber: string;
    service     : string;
    sede        : string;
    perfomance  : Date;
    duePerfomance: Date;
    electricalSecurity: Date;
    dueElectricalSecurity: Date;
    
    createdAt?: string;
    updatedAt?: string;
}
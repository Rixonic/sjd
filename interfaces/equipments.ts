export interface IEquipment {
    _id: string;
    equip: string;
    equipId: string;
    model: string;
    brand: string;
    sector: string;
    location: string;
    headquarter: 'CASTELAR'|'RAMOS MEJIA'
    images: string[];
    ecri: string;
    serialNumber: string;
    criticalType: ICriticalType;
    associatedEquip?:IEquipment[];
    
    perfomance  : Date;
    duePerfomance: Date;
    electricalSecurity: Date;
    dueElectricalSecurity: Date;
    

    // TODO: agregar createdAt y updatedAt
    createdAt: string;
    updatedAt: string;

}

//export type ISize = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL';
export type ICriticalType = 'CRITICO'|'NO CRITICO';
export type ILocation = 'QUIROFANO'|'ENDOSCOPIA'|'HEMODINAMIA'|'ENFERMERIA'|'NEONATOLOGIA'|'CONSULTORIOS';

export type ISize = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL';


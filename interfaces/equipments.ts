export interface IEquipment {
    location: any;
    _id: string;
    equip: string;
    equipmentId: string;
    model: string;
    brand: string;
    sector: string;
    locations: ILocation;
    headquarter: 'CASTELAR'|'RAMOS MEJIA'
    images: string[];
    ecri: string;
    serialNumber: string;
    criticalType: ICriticalType;
    

    // TODO: agregar createdAt y updatedAt
    createdAt: string;
    updatedAt: string;

}

//export type ISize = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL';
export type ICriticalType = 'CRITICO'|'NO CRITICO';
export type ILocation = 'QUIROFANO'|'ENDOSCOPIA'|'HEMODINAMIA'|'ENFERMERIA'|'NEONATOLOGIA'|'CONSULTORIOS';
export interface IEquipment {
    location: any;
    _id: string;
    equip: string;
    equipmentId: string;
    model: string;
    brand: string;
    sector: string;
    locations: string;
    headquarter: 'CASTELAR'|'RAMOS MEJIA'
    images: string[];
    ecri: string;
    serialNumber: string;
    criticalType: ICriticalType;
    associatedEquip?:IEquipment[];
    

    // TODO: agregar createdAt y updatedAt
    createdAt: string;
    updatedAt: string;

}

//export type ISize = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL';
export type ICriticalType = 'CRITICO'|'NO CRITICO';
export type ILocation = 'QUIROFANO'|'ENDOSCOPIA'|'HEMODINAMIA'|'ENFERMERIA'|'NEONATOLOGIA'|'CONSULTORIOS';

export type ISize = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL';

export interface IAssociatedEquip {
    _id: string;
    equip: string;
    equipmentId: string;
    brand: string;
    model: string;
    quantity: number;
    serialNumber: string;
    
}
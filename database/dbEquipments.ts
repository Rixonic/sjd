import { db } from './';
import { Equipment } from '../models';        //Se modifica
import { IEquipment } from '../interfaces';   //Se modifica


export const getEquipmentByEquip = async( equip: string ): Promise<IEquipment | null> => {

    await db.connect();
    const equipment = await Equipment.findOne({ equip }).lean();
    await db.disconnect();

    if ( !equipment ) {
        return null;
    }

    equipment.images = equipment.images.map( image => {
        return image.includes('http') ? image : `${ process.env.HOST_NAME}equipments/${ image }`
    });

    return JSON.parse( JSON.stringify( equipment ) );
}

export const getEquipmentByEquipId = async( equipId: string ): Promise<IEquipment | null> => {

    await db.connect();
    const equipment = await Equipment.findOne({ equipId }).lean();
    await db.disconnect();

    if ( !equipment ) {
        return null;
    }

    equipment.images = equipment.images.map( image => {
        return image.includes('http') ? image : `${ process.env.HOST_NAME}equipments/${ image }`
    });

    return JSON.parse( JSON.stringify( equipment ) );
}

export const getEquipmentBySubEquipId = async( equipId: string ): Promise<IEquipment | null> => {

    await db.connect();
    const equipment = await Equipment.findOne({ 'associatedEquip.equipId': equipId }).lean();
    await db.disconnect();

    if ( !equipment ) {
        return null;
    }

    equipment.images = equipment.images.map( image => {
        return image.includes('http') ? image : `${ process.env.HOST_NAME}equipments/${ image }`
    });

    return JSON.parse( JSON.stringify( equipment.associatedEquip ) );
}


interface EquipmentEquip {
    equip: string;
}
interface EquipmentEquipId {
    equipId: string;
}

export const getAllEquipmentEquip = async(): Promise<EquipmentEquip[]>  => {


    await db.connect();
    const equips = await Equipment.find().select('equip -_id').lean();
    await db.disconnect();

    return equips;
}

export const getAllEquipmentEquipId = async(): Promise<EquipmentEquipId[]>  => {


    await db.connect();
    const equips = await Equipment.find().select('equipId -_id').lean();
    await db.disconnect();

    return equips;
}


export const getEquipmentsByTerm = async ( term:string): Promise<IEquipment[]> => {
    
    term = term.toString().toLowerCase();

    await db.connect();
    const equipments = await Equipment.find({
        $text: { $search: term }
    })
    .select('title images price inStock equip -_id')
    .lean();

    await db.disconnect();

    const updatedEquipments = equipments.map( equipment => {
        equipment.images = equipment.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME}equipments/${ image }`
        });

        return equipment;
    })


    return updatedEquipments;
}


export const getAllEquipments = async(): Promise<IEquipment[]> => {

    await db.connect();
    const equipments = await Equipment.find().lean();
    await db.disconnect();


    const updatedEquipments = equipments.map( equipment => {
        equipment.images = equipment.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME}equipments/${ image }`
        });
        return equipment;
    });


    return JSON.parse( JSON.stringify( updatedEquipments ) );
}

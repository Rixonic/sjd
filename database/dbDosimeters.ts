import { db } from './';
import { Dosimeter } from '../models';        //Se modifica
import { IDosimeter } from '../interfaces';   //Se modifica


export const getDosimeterById = async( id: string ): Promise<IDosimeter | null> => {

    await db.connect();
    const dosimeter = await Dosimeter.findOne({ id }).lean();
    await db.disconnect();

    if ( !dosimeter ) {
        return null;
    }

    dosimeter.document = dosimeter.document.includes('http')
        ? dosimeter.document
        : `${process.env.HOST_NAME}equipments/${dosimeter.document}`;

    return JSON.parse( JSON.stringify( dosimeter ) );
}

export const getDosimeterByLocation = async (locations: string[]): Promise<IDosimeter | null> => {
    const lowerCaseLocations = locations.map(location => location.toUpperCase());
    
    await db.connect();
    const dosimeter = await Dosimeter.find({
        service: { $in: lowerCaseLocations }
    })
        .lean();
    await db.disconnect();

    if ( !dosimeter ) {
        return null;
    }
    console.log(dosimeter)

    for (let i = 0; i < dosimeter.length; i++) {
        delete dosimeter[i]._id;
      }
    return JSON.parse( JSON.stringify( dosimeter ) );
}


/*
interface EquipmentEquip {
    equip: string;
}

export const getAllEquipmentEquip = async(): Promise<EquipmentEquip[]>  => {


    await db.connect();
    const equips = await Equipment.find().select('equip -_id').lean();
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
*/
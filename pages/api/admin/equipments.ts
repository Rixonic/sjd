import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose';

import { v2 as cloudinary } from 'cloudinary';
cloudinary.config( process.env.CLOUDINARY_URL || '' );

import { db } from '../../../database';
import { IEquipment } from '../../../interfaces/equipments';
import { Equipment } from '../../../models';

type Data = 
| { message: string }
| IEquipment[]
| IEquipment;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'GET':
            return getEquipments( req, res );
            
        case 'PUT':
            return updateEquipment( req, res );

        case 'POST':
            return createEquipment( req, res )
            
        default:
            return res.status(400).json({ message: 'Bad request' });
    }
    
 
}

const getEquipments = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    await db.connect();

    const equipments = await Equipment.find()
        .sort({ equip: 'asc' })
        .lean();

    await db.disconnect();

    // TODO:
    const updatedEquipments = equipments.map( equipment => {
        equipment.images = equipment.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME}equipments/${ image }`
        });

        return equipment;
    })


    res.status(200).json( updatedEquipments );

}


const updateEquipment = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { _id = '', images = [] } = req.body as IEquipment;

    if ( !isValidObjectId( _id ) ) {
        return res.status(400).json({ message: 'El id del producto no es válido' });
    }
    /*
    if ( images.length < 2 ) {
        return res.status(400).json({ message: 'Es necesario al menos 2 imágenes' });
    }
    */

    // TODO: posiblemente tendremos un localhost:3000/products/asdasd.jpg


    try {
        
        await db.connect();
        const equipment = await Equipment.findById(_id);
        if ( !equipment ) {
            await db.disconnect();
            return res.status(400).json({ message: 'No existe un producto con ese ID' });
        }

        // TODO: eliminar fotos en Cloudinary
        // https://res.cloudinary.com/cursos-udemy/image/upload/v1645914028/nct31gbly4kde6cncc6i.jpg
        equipment.images.forEach( async(image) => {
            if ( !images.includes(image) ){
                // Borrar de cloudinary
                const [ fileId, extension ] = image.substring( image.lastIndexOf('/') + 1 ).split('.')
                console.log({ image, fileId, extension });
                await cloudinary.uploader.destroy( fileId );
            }
        });

        await equipment.update( req.body );
        await db.disconnect();
        

        return res.status(200).json( equipment );
        
    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }

}

const createEquipment = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { images = [] } = req.body as IEquipment;
    
    //test
    /*
    if ( images.length < 2 ) {                                                          //modificar?
        return res.status(400).json({ message: 'El producto necesita al menos 2 imágenes' });
    }
    */


    // TODO: posiblemente tendremos un localhost:3000/products/asdasd.jpg
    
    try {
        await db.connect();
        const equipmentInDB = await Equipment.findOne({ equip: req.body.equip });
        if ( equipmentInDB ) {
            await db.disconnect();
            return res.status(400).json({ message: 'Ya existe un producto con ese equipo' });
        }
        
        const equipment = new Equipment( req.body );
        await equipment.save();
        await db.disconnect();

        res.status(201).json( equipment );


    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({ message: 'Revisar logs del servidor' });
     }

}


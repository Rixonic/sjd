import type { NextApiRequest, NextApiResponse } from 'next'

import { isValidObjectId } from 'mongoose';

import { v2 as cloudinary } from 'cloudinary';
cloudinary.config( process.env.CLOUDINARY_URL || '' );
import { format } from 'date-fns';
import { db } from '../../../database';
import { IDosimeter } from '../../../interfaces/dosimeter';
import { Dosimeter } from '../../../models';

type Data = 
| { message: string }
| IDosimeter[]
| IDosimeter;

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
    const { service} = req.query;

    await db.connect();

    let query = Dosimeter.find();
    if (service) {
        query = query.where('service', service);
    }
    
    query = query.sort({year: -1, month: -1 });

    const equipments = await query.lean();



    // Verificar y formatear la fecha de perfomance

    await db.disconnect();

    res.status(200).json(equipments);

}


const updateEquipment = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { _id = '' } = req.body as IDosimeter;

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
        const equipment = await Dosimeter.findById(_id);
        if ( !equipment ) {
            await db.disconnect();
            return res.status(400).json({ message: 'No existe un producto con ese ID' });
        }

        // TODO: eliminar fotos en Cloudinary
        // https://res.cloudinary.com/cursos-udemy/image/upload/v1645914028/nct31gbly4kde6cncc6i.jpg=

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
    
    //const {  } = req.body as IEquipmentService;
    
    //test
    /*
    if ( images.length < 2 ) {                                                          //modificar?
        return res.status(400).json({ message: 'El producto necesita al menos 2 imágenes' });
    }
    */


    // TODO: posiblemente tendremos un localhost:3000/products/asdasd.jpg
    
    try {
        await db.connect();
        const equipmentInDB = await Dosimeter.findOne({ _id: req.body._id });
        if ( equipmentInDB ) {
            await db.disconnect();
            return res.status(400).json({ message: 'Ya existe un producto con ese equipo' });
        }
        
        const equipment = new Dosimeter( req.body );
        await equipment.save();
        await db.disconnect();

        res.status(201).json( equipment );


    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({ message: 'Revisar logs del servidor' });
     }

}


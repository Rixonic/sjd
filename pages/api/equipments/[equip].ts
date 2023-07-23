import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Equipment } from '../../../models';
import { IEquipment } from '../../../interfaces';


type Data = 
| { message: string }
| IEquipment;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    
    switch( req.method ) {
        case 'GET':
            return getEquipmentByEquip(req, res);

        default:
            return res.status(400).json({
                message: 'Bad request'
            })
    }

}

async function getEquipmentByEquip(req: NextApiRequest, res: NextApiResponse<Data>) {

    await db.connect();
    const { equip } = req.query;
    const equipment = await Equipment.findOne({ equip }).lean();
    await db.disconnect();

    if( !equipment ) {
        return res.status(404).json({
            message: 'Producto no encontrado'
        })
    }

    equipment.images = equipment.images.map( image => {
        return image.includes('http') ? image : `${ process.env.HOST_NAME}equipments/${ image }`
    });

    return res.json( equipment );


}
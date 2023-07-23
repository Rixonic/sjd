import type { NextApiRequest, NextApiResponse } from 'next'
import { db, SHOP_CONSTANTS } from '../../../database'
import { Equipment } from '../../../models'
import { IEquipment } from '../../../interfaces/equipments';

type Data = 
| { message: string }
| IEquipment[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch( req.method ) {
        case 'GET':
            return getEquipments( req, res )

        default:
            return res.status(400).json({
                message: 'Bad request'
            })
    }
}

const getEquipments = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { gender = 'all' } = req.query;

    let condition = {};

    if ( gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(`${gender}`) ) {
        condition = { gender };
    }

    await db.connect();
    const equipments = await Equipment.find(condition)
                                .select('title images price inStock slug -_id')
                                .lean();

    await db.disconnect();

    const updatedEquipments = equipments.map( equipment => {
        equipment.images = equipment.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME}equipments/${ image }`
        });

        return equipment;
    })


    return res.status(200).json( updatedEquipments );

}

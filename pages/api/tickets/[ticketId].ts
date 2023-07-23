import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Ticket } from '../../../models';
import { ITicket } from '../../../interfaces';

type Data = 
| { message: string }
| ITicket;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    
    switch( req.method ) {
        case 'GET':
            return getTicketByTicketId(req, res);

        default:
            return res.status(400).json({
                message: 'Bad request'
            })
    }

}

async function getTicketByTicketId(req: NextApiRequest, res: NextApiResponse<Data>) {

    await db.connect();
    const { ticketId } = req.query;
    const ticket = await Ticket.findOne({ ticketId }).lean();
    await db.disconnect();

    if( !ticket ) {
        return res.status(404).json({
            message: 'Producto no encontrado'
        })
    }

    ticket.images = ticket.images.map( image => {
        return image.includes('http') ? image : `${ process.env.HOST_NAME}tickets/${ image }`
    });

    return res.json( ticket );


}

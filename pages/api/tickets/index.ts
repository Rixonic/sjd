import type { NextApiRequest, NextApiResponse } from 'next'
import { db, SHOP_CONSTANTS } from '../../../database'
import { Ticket } from '../../../models'
import { ITicket } from '../../../interfaces/tickets';

type Data = 
| { message: string }
| ITicket[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch( req.method ) {
        case 'GET':
            return getTickets( req, res )

        default:
            return res.status(400).json({
                message: 'Bad request'
            })
    }
}

const getTickets = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { gender = 'all' } = req.query;

    let condition = {};

    if ( gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(`${gender}`) ) {
        condition = { gender };
    }

    await db.connect();
    const tickets = await Ticket.find(condition)
                                .select('title images price inStock slug -_id')
                                .lean();

    await db.disconnect();

    const updatedTickets = tickets.map( ticket => {
        ticket.images = ticket.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME}tickets/${ image }`
        });

        return ticket;
    })


    return res.status(200).json( updatedTickets );

}

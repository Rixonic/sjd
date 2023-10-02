import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose';

import { v2 as cloudinary } from 'cloudinary';
cloudinary.config( process.env.CLOUDINARY_URL || '' );

import { db } from '../../../database';
import { ITicket } from '../../../interfaces/tickets';
import { Ticket } from '../../../models';

type Data = 
| { message: string }
| ITicket[]
| ITicket;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'GET':
            return getTickets( req, res );
            
            case 'PUT':
                return updateTickets(req, res);

        case 'POST':
            return createTickets( req, res )

        case 'DATE':
                return createTickets( req, res )
            
        default:
            return res.status(400).json({ message: 'Bad request' });
    }
    
 
}

const getTickets = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    await db.connect();

    const tickets = await Ticket.find()
        .sort({ tiquetId: 'asc' })
        .lean();

    await db.disconnect();

    // TODO:
    const updatedTickets = tickets.map( ticket => {
        ticket.images = ticket.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME}tickets/${ image }`
        });

        return ticket;
    })


    res.status(200).json( updatedTickets );

}

/*
const updateTickets = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { _id = '', images = [] } = req.body as ITicket;

    if ( !isValidObjectId( _id ) ) {
        return res.status(400).json({ message: 'El id del producto no es válido' });
    }


    // TODO: posiblemente tendremos un localhost:3000/products/asdasd.jpg


    try {
        
        await db.connect();
        const ticket = await Ticket.findById(_id);
        
        if ( !ticket ) {
            await db.disconnect();
            return res.status(400).json({ message: 'No existe un producto con ese ID' });
        }

        // TODO: eliminar fotos en Cloudinary
        // https://res.cloudinary.com/cursos-udemy/image/upload/v1645914028/nct31gbly4kde6cncc6i.jpg
        ticket.images.forEach( async(image) => {
            if ( !images.includes(image) ){
                // Borrar de cloudinary
                const [ fileId, extension ] = image.substring( image.lastIndexOf('/') + 1 ).split('.')
                console.log({ image, fileId, extension });
                await cloudinary.uploader.destroy( fileId );
            }
        });
        console.log(ticket)
        await ticket.update( req.body );
        await db.disconnect();
        

        return res.status(200).json( ticket );
        
    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }

}
*/
const updateTickets = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { _id = '', comments = [], estimatedFinish = null } = req.body as ITicket;

    if (!isValidObjectId(_id)) {
        return res.status(400).json({ message: 'El id del ticket no es válido' });
    }

    try {
        await db.connect();
        const ticket = await Ticket.findById(_id);

        if (!ticket) {
            await db.disconnect();
            return res.status(400).json({ message: 'No existe un ticket con ese ID' });
        }
        //console.log(ticket.comments)
        if (req.body.comments)
        ticket.comments = comments; // Actualiza los comentarios en el ticket

        if(req.body.estimatedFinish ){

            ticket.estimatedFinish = req.body.estimatedFinish;
        }
        if(req.body.priority ){
            //console.log(req.body.priority)
            ticket.priority = req.body.priority;
        }
        if(req.body.status ){
            //console.log(req.body.priority)
            ticket.status = req.body.status;
        }
        if(req.body.assignedTo ){
            //console.log(req.body.priority)
            ticket.assignedTo = req.body.assignedTo;
        }

        if(req.body.finishBy ){
            //console.log(req.body.priority)
            ticket.finishBy = req.body.finishBy;
            ticket.finishAt = req.body.finishAt; 
        }
        if(req.body.diagnostic ){
            //console.log(req.body.priority)
            ticket.diagnostic.user = req.body.diagnostic.user;
            ticket.diagnostic.observation = req.body.diagnostic.observation; 
        }
        //console.log(req.body)
        console.log(ticket)
        //await ticket.update( req.body );
        await ticket.save(); // Guarda el ticket actualizado con los nuevos comentarios
        await db.disconnect();

        return res.status(200).json(ticket);

    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }
};

const createTickets = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { images = [], sector, type } = req.body as ITicket;
    //test
    /*
    if ( images.length < 2 ) {                                                          //modificar?
        return res.status(400).json({ message: 'El producto necesita al menos 2 imágenes' });
    }
    */
    try {
        await db.connect();
        const ticketInDB = await Ticket.findOne({ ticketId: req.body.equip });
        if ( ticketInDB ) {
            await db.disconnect();
            return res.status(400).json({ message: 'Ya existe un producto con ese equipo' });
        }
        const ticket = new Ticket(req.body);
        await ticket.save(); 
        await db.disconnect();

        res.status(201).json( ticket );


    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({ message: 'Revisar logs del servidor' });
     }

}


import { db } from './';
import { Ticket } from '../models';
import { ITicket } from '../interfaces';



export const getTicketByTicketId = async( ticketId: string ): Promise<ITicket | null> => {

    await db.connect();
    const ticket = await Ticket.findOne({ ticketId }).lean();
    await db.disconnect();

    if ( !ticket ) {
        return null;
    }

    ticket.images = ticket.images.map( image => {
        return image.includes('http') ? image : `${ process.env.HOST_NAME}tickets/${ image }`
    });

    return JSON.parse( JSON.stringify( ticket ) );
}

interface TicketTicketId {
    ticketId: string;
}

export const getAllTicketTicketId = async(): Promise<TicketTicketId[]>  => {


    await db.connect();
    const ticketId = await Ticket.find().select('ticketId -_id').lean();
    await db.disconnect();

    return ticketId;
}

export const getAllTicketEquipId = async(): Promise<TicketTicketId[]>  => {


    await db.connect();
    const ticketId = await Ticket.find().select('associatedEquipId -_id').lean();
    await db.disconnect();

    return ticketId;
}

export const getTicketsByEquipmentId = async (equip: string): Promise<ITicket[]> => {
    await db.connect();
    const tickets = await Ticket.find({ associatedEquipId: equip }).lean();
    await db.disconnect();
  
    const updatedTickets = tickets.map((ticket) => {
      ticket.images = ticket.images.map((image) => {
        return image.includes('http') ? image : `${process.env.HOST_NAME}tickets/${image}`;
      });
      return ticket;
    });
  
    return JSON.parse(JSON.stringify(updatedTickets));
  }

export const getTicketsByTerm = async ( term:string): Promise<ITicket[]> => {
    
    term = term.toString().toLowerCase();

    await db.connect();
    const tickets = await Ticket.find({
        $text: { $search: term }
    })
    .select('title images price inStock slug -_id')
    .lean();

    await db.disconnect();

    const updatedTickets = tickets.map( ticket => {
        ticket.images = ticket.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME}tickets/${ image }`
        });

        return ticket;
    })


    return updatedTickets;
}


export const getAllTickets = async(): Promise<ITicket[]> => {

    await db.connect();
    const tickets = await Ticket.find().lean();
    await db.disconnect();


    const updatedTickets = tickets.map( ticket => {
        ticket.images = ticket.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME}tickets/${ image }`
        });
        return ticket;
    });


    return JSON.parse( JSON.stringify( updatedTickets ) );
}



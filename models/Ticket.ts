import mongoose, { Schema, model, Model } from 'mongoose';
import { ITicket } from '../interfaces';


const ticketSchema = new Schema({
    ticketId: { type: String, unique: true },
    location: { type: String },
    images: [{ type: String }],
    status: {
        type: String,
        enum: {
            values: ['Finalizado','En progreso'],
            message: '{VALUE} no es un estado valido'
        },
        default: 'En progreso'
    },
    summary: { type: String, default: '' }, 
       
    detail: { type: String, default: '' },    
    user: { type: String, default: '' },    
    assignedTo: { type: String, default: '' },  
   
    equipId: { type: String },
    comment: [{
        _id : { type: String },
        user  : { type: String},
        commentary   : { type: String},
        dateTime: { type: String},
    }],
    diagnostic: {
        _id : { type: String },
        user  : { type: String },
        observation   : { type: String },
    },
    isTechnician: { type: Boolean },
    isSupervisor: { type: Boolean },
    isService: { type: Boolean },
},{
    timestamps: true
});


ticketSchema.index({ title: 'text', tags: 'text' });


const Ticket: Model<ITicket> = mongoose.models.Ticket || model('Ticket', ticketSchema );


export default Ticket;
import mongoose, { Schema, model, Model } from 'mongoose';
import { ITicket } from '../interfaces';


const ticketSchema = new Schema({
    ticketId: { type: String, unique: true },
    location: { type: String },
    images: [{ type: String }],
    status: {
        type: String,
        default: 'Solicitud creada'
    },
    priority: {
        type: String,
        enum: {
            values: ['ALTA','MEDIA','BAJA'],
            message: '{VALUE} no es un locacion válida'
        }
    },
    summary: { type: String, default: '' }, 
    estimatedFinish:  { type: Date },
    detail: { type: String, default: '' },    
    user: { type: String, default: '' },    
    assignedTo: { type: String, default: '' },  
    finishBy: { type: String },  
    type: { type: String},  
    sector: { type: String },  
    equipId: { type: String },
    comments: [{
        user: { type: String },
        comment: { type: String }, // Cambia el tipo del campo a String
        createdAt: { type: Date, default: Date.now }
      }],
    diagnostic: {
        user  : { type: String , default: '' },
        observation   : { type: String, default: ''  },
    },
    isTechnician: { type: Boolean },
    isSupervisor: { type: Boolean },
    isService: { type: Boolean },
    finishAt: {type: Date},
},{
    timestamps: true
});


ticketSchema.index({ title: 'text', tags: 'text' });


const Ticket: Model<ITicket> = mongoose.models.Ticket || model('Ticket', ticketSchema );


export default Ticket;
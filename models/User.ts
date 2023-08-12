import mongoose, { Schema, model, Model } from 'mongoose';
import { IUser } from '../interfaces';

const userSchema = new Schema({

    name    : { type: String, required: true },
    email   : { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: {
            values: ['admin','visitante','servicio','tecnico','supervisor'],
            message: '{VALUE} no es un role válido',
            default: 'visitante',
            required: true
        }
    },
    sector: {
        type: String,
        enum: {
            values: ['ingenieria','instalaciones','electromedicina','SeH','neonatologia','uti','consultorios','quirofano','imagenes','endoscopia','hemodinamia','internacion','pendiente'],
            message: '{VALUE} no es un role válido',
            default: 'pendiente',
            required: true
        }
    }
}, {
    timestamps: true,
})

const User:Model<IUser> = mongoose.models.User || model('User',userSchema);

export default User;
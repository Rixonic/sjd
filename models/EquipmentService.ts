import mongoose, { Schema, model, Model } from 'mongoose';
import { IEquipmentService } from '../interfaces';

const userSchema = new Schema({
    ownId       : { type: Number, required: true },
    ecri        : { type: String },
    equip       : { type: String, required: true },
    brand       : { type: String, required: true },
    model       : { type: String, required: true },
    serialNumber: { type: String, required: true },
    sede        : { type: String, required: true },
    service     : {
        type: String,
        enum: {
            values: ['quirofano','hemodinamia','neonatologia','guardia','uti','consultorios','imagenes','endoscopia','internacion','cardiologia','pendiente'],
            message: '{VALUE} no es un servicio válido',
            default: 'pendiente',
            required: true
        }
    },
    perfomance  : { type: Date },
    duePerfomance: { type: Date },
    electricalSecurity: { type: Date },
    dueElectricalSecurity: { type: Date },

}, {
    timestamps: true,
})

const EquipmentService:Model<IEquipmentService> = mongoose.models.EquipmentService || model('EquipmentService',userSchema);

export default EquipmentService;
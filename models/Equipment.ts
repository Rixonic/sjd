import mongoose, { Schema, model, Model } from 'mongoose';
import { IEquipment } from '../interfaces';

const equipmentSchema = new Schema({
    equipId: { type: String, required: true,unique: true },
    model: { type: String, required: true, default: '' },
    brand: { type: String, required: true, default: '' },
    sector: { type: String, required: true, default: '' },
    equip: { type: String, required: true, default: '' },
    location: {
        type: String,
        enum: {
            values: ['QUIROFANO','ENDOSCOPIA','HEMODINAMIA','ENFERMERIA','NEONATOLOGIA','CONSULTORIOS'],
            message: '{VALUE} no es un locacion válida'
        }
    },
    headquarter: [{
        type: String,
        enum: {
            values: ['CASTELAR','RAMOS MEJIA'],
            message: '{VALUE} no es un locacion válida'
        }
    }],
    images: [{ type: String }],
    ecri: { type: String, required: true, default: '' },
    serialNumber: { type: String, required: true , default: '' }, //agregar el unique: true cuando se corriga el numero de serie
    criticalType: {
        type: String,
        enum: {
            values: ['CRITICO','NO CRITICO'],
            message: '{VALUE} no es un tipo válido'
        },
    },
    perfomance  : { type: Date },
    duePerfomance: { type: Date },
    electricalSecurity: { type: Date },
    dueElectricalSecurity: { type: Date },

},{
    timestamps: true
});
equipmentSchema.add({associatedEquip: [equipmentSchema]})

equipmentSchema.index({ title: 'text', tags: 'text' });


const Equipment: Model<IEquipment> = mongoose.models.Equipment || model('Equipment', equipmentSchema );


export default Equipment;
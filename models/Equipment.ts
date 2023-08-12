import mongoose, { Schema, model, Model } from 'mongoose';
import { IEquipment } from '../interfaces';


const equipmentSchema = new Schema({
    equipmentId: { type: String, required: true },
    model: { type: String, required: true, default: '' },
    brand: { type: String, required: true, default: '' },
    sector: { type: String, required: true, default: '' },
    equip: { type: String, required: true, default: '' ,unique: true},
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
    serialNumber: { type: String, required: true}, //agregar el unique: true cuando se corriga el numero de serie
    criticalType: {
        type: String,
        enum: {
            values: ['CRITICO','NO CRITICO'],
            message: '{VALUE} no es un tipo válido'
        },
    },
    associatedEquip: [{
        _id: { type: String },
        equip: { type: String },
        equipmentId: { type: String },
        brand: { type: String },
        model: { type: String },
        quantity: { type: Number },
        serialNumber: { type: String },
    }]


},{
    timestamps: true
});


equipmentSchema.index({ title: 'text', tags: 'text' });


const Equipment: Model<IEquipment> = mongoose.models.Equipment || model('Equipment', equipmentSchema );


export default Equipment;
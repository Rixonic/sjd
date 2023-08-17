import mongoose, { Schema, model, Model } from 'mongoose';
import { IDosimeter } from '../interfaces';

const userSchema = new Schema({
    //ownId       : { type: Number },
    year        : { type: Number, required: true },
    month       : { type: Number, required: true },
    headquarter : { type: String, required: true },
    service     : { type: String, required: true },
    location     : { type: String, required: true },
    document    : { type: String, required: true },
}, {
    timestamps: true,
})

const Dosimeter:Model<IDosimeter> = mongoose.models.Dosimeter || model('Dosimeter',userSchema);

export default Dosimeter;
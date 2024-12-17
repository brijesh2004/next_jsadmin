import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const adminSchema = new mongoose.Schema({
    adminname:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    token: {
        type: String,
    },
    tokenExpiresAt: {
        type: Date
    },
})
adminSchema.methods.generateAutoToken = async function () {
    try {
        
        const token = jwt.sign({ _id: this._id, adminname: this.username }, process.env.SECRET_KEY, { expiresIn: '30d' });
        this.token = token;
        this.tokenExpiresAt = Date.now() +30* 24 * 60 * 60 * 1000;   
        await this.save();
        return token;
    } catch (err) {
        console.log(err);
    }
}


const Admin = mongoose.model('Admin' , adminSchema);

export {Admin};
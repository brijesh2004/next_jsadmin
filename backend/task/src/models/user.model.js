import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "User Name is Required"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is Required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    token: {
        type: String,
    },
    tokenExpiresAt: {
        type: Date
    },
    isActive:{
        type:String,
        default:"Active"
    }
});

userSchema.methods.generateAutoToken = async function () {
    try {
        
        const token = jwt.sign({ _id: this._id, username: this.username }, process.env.SECRET_KEY, { expiresIn: '30d' });
        this.token = token;
        this.tokenExpiresAt = Date.now() +30* 24 * 60 * 60 * 1000;   
        await this.save();

        return token;
    } catch (err) {
        console.log(err);
    }
}

const User = mongoose.model('User', userSchema);

export { User };

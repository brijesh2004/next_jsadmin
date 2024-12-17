import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        index:true
    },
    balance:{
        type:Number,
        default:0
    },
    isFreeze:{
        type:String,
        default:"No"
    }
})

const Wallet = mongoose.model('Wallet' , walletSchema);
export {Wallet};
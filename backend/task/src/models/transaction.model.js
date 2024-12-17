import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    walletid: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Wallet", 
        required: true,
    },
    type: {
        type: String,
        required: [true, "Transaction type is required"],
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"], 
        min: [0, "Amount cannot be negative"], 
    },
    category: {
        type: String,
        required: true, 
    },
}, { timestamps: true }); 

const Transaction = mongoose.model("Transaction", transactionSchema);

export { Transaction };

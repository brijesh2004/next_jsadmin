import express from "express";
import { Wallet } from "../models/wallet.model.js";
import { Transaction } from "../models/transaction.model.js";

const router = express.Router();



router.post("/buy", async (req, res) => {
    try {
        const userid = req.userID;
        const wallet = await Wallet.findOne({ userid: userid });
        const walletid = wallet._id;
        let { type, amount, category } = req.body;
        amount = parseInt(amount);

        if (amount > wallet.balance) {
            return res.status(400).json({ error: "You have Not Enough Balance" });
        }
        const newTransaction = new Transaction({ walletid, type, amount, category });
        wallet.balance -= amount;
        await wallet.save();
        await newTransaction.save();
        return res.status(201).json({ message: "Thanks for Buy. Have a good Day" });
    }
    catch (error) {
        return res.status(400).json({ error: "Something went wrong" });
    }
});

router.get("/history", async (req, res) => {
    try {
        const date = req.query.date;
        const userid = req.userID;
        console.log("Query Date:", date);

        const wallet = await Wallet.findOne({ userid: userid });
        if (!wallet) {
            return res.status(404).json({ error: "Wallet not found" });
        }

        const walletId = wallet._id;
        let transaction;

        if (!date) {
            transaction = await Transaction.find({ walletid: walletId })
                .select("type amount category createdAt");
        } else {
            const [day, month, year] = date.split("-");
            const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
            const endDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59));

            console.log("Start Date:", startDate);
            console.log("End Date:", endDate);

            transaction = await Transaction.find({
                walletid: walletId, // Match wallet ID key
                createdAt: {
                    $gte: startDate,
                    $lte: endDate,
                },
            }).select("type amount category createdAt");
        }

        console.log("Fetched Transactions:", transaction);
        return res.status(200).json(transaction);
    } catch (err) {
        console.error("Error:", err);
        return res.status(400).json({ error: "Something went wrong" });
    }
});


export { router };
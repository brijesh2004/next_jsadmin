import express from 'express';
import { Wallet } from '../models/wallet.model.js';
import { Transaction } from '../models/transaction.model.js';
const router = express.Router();


router.get("/checkWallet", async (req, res) => {
    try {
        const userID = req.userID;
        console.log("User id", userID.toString());

        const walletFind = await Wallet.findOne({userid: userID });

        if (!walletFind) {
            return res.status(400).json({ error: "No wallet Found, Setup the Wallet first or add some money"});
        }
        if(walletFind.isFreeze==="Yes"){
            return res.status(403).json({error:"Wallet is freezed please contact team"});
        }
        return res.status(200).json({ amount: walletFind.balance });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ error: "Something wents wrong" });
    }
})



router.post("/addtowallet", async (req, res) => {
    try {
        const userid = req.userID;
        let {type, amount, category} = req.body;
        amount = parseInt(amount);

        const findWallet = await Wallet.findOne({ userid: userid });
        if (!findWallet) {
            const newWallet = new Wallet({ userid, amount});
            await newWallet.save();
            const walletid = newWallet._id;
            const newTransaction = new Transaction({ walletid, type, amount, category});
            await newTransaction.save();
        }
        else {
            findWallet.balance += amount;
            await findWallet.save();
            const walletid = findWallet._id;
            const newTransaction = new Transaction({ walletid, type, amount, category});
            await newTransaction.save();

        }

        return res.status(201).json({ message: "Balance added to Wallet" });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ error: "Something wents wrong" });
    }
})


export { router };
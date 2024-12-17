import express from 'express';
import { Admin } from '../../models/admin/admin.model.js';
import bcrypt from 'bcryptjs';
import { adminAuth } from '../../middleware/adminAuth.js';
import { User } from '../../models/user.model.js';
import { Wallet } from '../../models/wallet.model.js';

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { adminname, email, password } = req.body;
        console.log(adminname, email, password);
        if (!adminname || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const checkAdmin = await Admin.findOne({ email: email });
        if (checkAdmin) {
            return res.status(400).json({ error: "Admin already exists with this email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        const newAdmin = new Admin({
            adminname,
            email,
            password: hashedPassword,
        });

        await newAdmin.save();

        const token = await newAdmin.generateAutoToken();

        res.cookie("admintoken", token, {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: 'none',
            secure: true
        });


        res.status(201).json({ message: "Admin registered successfully", token: token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Something went wrong" });
    }
});



router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const admin = await Admin.findOne({ email: email });
        if (!admin) {
            return res.status(400).json({ error: "Admin not found" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = await admin.generateAutoToken();

        res.cookie("admintoken", token, {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: 'none',
            secure: true
        });

        res.status(201).json({ message: "Admin Login successfully", token: token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Something went wrong" });
    }
});



router.get("/access", adminAuth, async (req, res) => {
    try {
        const email = req.query.email;
        console.log(email);
        const account = await User.findOne({ email: email });
        if (!account) {
            return res.status(400).json({ error: "No User Find" });
        }
        const isActive = account.isActive;
        const userid = account._id;
        const wallet = await Wallet.findOne({ userid: userid });
        if (!wallet) {
            return res.status(400).json({ error: "No Wallet find or wallet is not setup" });
        }
        const isFreeze = wallet.isFreeze;
        const walletid = wallet._id;
        return res.status(200).json({ user: { isActive, userid }, wallet: { isFreeze, walletid } });
    }
    catch (error) {
        return res.status(400).json({ error: "Error while accessing" });
    }
})


router.get("/accountstatus",adminAuth, async (req, res) => {
    try {
        //    console.log(req.params);
        console.log("hello");
        const {id, isuser} = req.query;
        console.log("isuser-> " ,typeof isuser);
        console.log("id-> " ,id);
        console.log("isuser-> " ,isuser);

        if (!id && !isuser) {
            return res.status(400).json({ error: "please provide the userid or wallletid" });
        }
        // update the wallet
        console.log("hello" , isuser==="false");
        if (isuser==="false") {
             console.log("enter");
            const findwallet = await Wallet.findById(id);
            console.log(findwallet);
            if (!findwallet) {
                return res.status(404).json({ error: "Wallet Not Found" });
            }
            if (findwallet.isFreeze === "No") {
                findwallet.isFreeze = "Yes";
            }
            else {
                findwallet.isFreeze = "No";
            }
            findwallet.save();
            return res.status(200).json({ message: "Updated" });
        }

        const finduser = await User.findById(id);
        if (!finduser) {
            return res.status(404).json({ error: "User Not Found" });
        }
        if (finduser.isActive === "Active") {
            finduser.isActive = "InActive";
        }
        else {
            finduser.isActive = "Active";
        }
        await finduser.save();

        return res.status(200).json({ message: "Updated!" });
    }
    catch (error) {
        return res.status(400).json({ error: "Error while updating status" });
    }
})

export { router };
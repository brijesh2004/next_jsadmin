import express from "express";
import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.get("/",(req , res)=>{
    res.status(200).send("Hello from router");
})

router.post('/register' , async (req , res)=>{
    try{
       let {username , email , password} = req.body;
       if(!username|| !email ||!password){
         return res.status(400).json({error:"All fields are required"});
       }
       const userfind = await User.findOne({
        $or: [
            { username: username }, 
            { email: email }
        ]
       });
       if(userfind){
        return res.status(400).json({error:"User Already Present"});
       }
       password = await bcrypt.hash(password , 10);
       const newUser = User({username , email , password});
       await newUser.save();
       const token = await newUser.generateAutoToken();

       res.cookie("jwttoken", token, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: 'none',
        secure: true
       });    

       return res.status(201).json({message:"User Created Successful" ,token:token});
   }
    catch(error){
      console.log(error);
      return res.status(500).json({error:"Something went wrong"});
    }
})


router.post("/login" ,async (req , res)=>{
    try{
      const {email , username,password} = req.body;
      const userfind = await User.findOne({
        $or: [
            { username: username }, 
            { email: email }
        ]
       });

       if(!userfind){
        return res.status(400).json({error:"Wrong Credential"});
       }
       if(userfind.isActive!=='Active'){
         return res.status(404).json({error:'Account is Not Active please contact the team'});
       }
       const matchPassword = await bcrypt.compare(password ,userfind.password);
       if(!matchPassword){
        return res.status(400).json({error:"Wrong Credential"});
       }
       const token = await userfind.generateAutoToken();

       res.cookie("jwttoken", token, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expires
        httpOnly: true,
        sameSite: 'none',
        secure: true
       }); 

       return res.status(201).json({message:"User Login Successful" , token:token});

    }
    catch(error){
        console.log(error);
        return res.status(500).json({error:"Something went Wrong"});
    }
})

export {router};
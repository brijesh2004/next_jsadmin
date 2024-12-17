import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const DB = process.env.DATABASE;

mongoose.connect(DB , {
}).then(()=>{
    console.log("Connection successfull");
}).catch((err)=>{
   console.log("no connection");
})

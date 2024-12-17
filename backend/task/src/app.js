import express from "express";
import { router as userRouter } from "./routers/approute.js";
import {router as walletRouter} from "./routers/walletrouter.js";
import { authenticate } from "./middleware/authenticate.js";
import {router as transaction} from './routers/transactionrouter.js';
import {router as adminRouter} from './routers/admin/adminregister.js';
import cookieParser from 'cookie-parser';
import './db/connect.js';
import cors from 'cors';




const app = express();
app.use(cors({
    origin:'http://localhost:3000',
    credentials:true,
}));
app.use(express.json());
app.use(cookieParser());
app.use("/user" , userRouter);
app.use("/wallet" ,authenticate , walletRouter);
app.use("/transaction" , authenticate , transaction);
app.use("/admin" , adminRouter);



app.listen(7000,()=>{
    console.log("App is listening on 7000");
})
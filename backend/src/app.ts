import express from 'express'; import cors from 'cors'; import helmet from 'helmet'; import cookieParser from 'cookie-parser'; import { corsOrigins } from './config/env.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { catalogRouter } from './modules/catalog/catalog.routes.js';
export const app=express(); app.use(helmet()); app.use(cors({origin:(origin,cb)=>!origin||corsOrigins.includes(origin)?cb(null,true):cb(new Error('CORS origin denied')),credentials:true})); app.use(express.json()); app.use(cookieParser()); app.use('/api/v1/auth',authRouter); app.use('/api/v1',catalogRouter); app.get('/health',(_,res)=>res.status(200).json({status:'ok'}));
app.get('/',(_,res)=>res.json({name:'Heritage Loom API',status:'ok'}));
app.use((err:Error,_req:express.Request,res:express.Response,_next:express.NextFunction)=>res.status(500).json({error:{code:'INTERNAL_ERROR',message:err.message,details:[]}}));

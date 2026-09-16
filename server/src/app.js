import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { allowedOrigins, env, isProduction } from './config/env.js';
import { logger } from './config/logger.js';
import { errorHandler, notFound } from './middleware/errors.js';
import routes from './routes/index.js';

export const app=express();
if(env.TRUST_PROXY)app.set('trust proxy',env.TRUST_PROXY);
app.disable('x-powered-by');
app.use(pinoHttp({logger,genReqId:(req,res)=>{const id=req.headers['x-request-id']||crypto.randomUUID();res.setHeader('x-request-id',id);return id}}));
app.use(helmet({contentSecurityPolicy:isProduction?undefined:false,crossOriginResourcePolicy:{policy:'cross-origin'}}));
app.use(cors({origin(origin,callback){if(!origin||allowedOrigins.includes(origin))return callback(null,true);callback(new Error('Origin not allowed'))},credentials:true,methods:['GET','POST','PATCH','DELETE','OPTIONS']}));
app.use(compression());app.use(express.json({limit:'250kb'}));app.use(express.urlencoded({extended:false,limit:'50kb'}));app.use(cookieParser());
app.use('/api/v1',routes);app.use(notFound);app.use(errorHandler);

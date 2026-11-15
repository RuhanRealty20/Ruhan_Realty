import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { allowedOrigins, env, isProduction } from './config/env.js';
import { logger } from './config/logger.js';
import { errorHandler, notFound } from './middleware/errors.js';
import routes from './routes/index.js';
import { ApiError } from './utils/api.js';

export const app=express();
const clientDist=fileURLToPath(new URL('../../client/dist/',import.meta.url));
const publicRoutes=new Set(['/','/properties','/buy','/sell','/rent','/landlord','/invest','/relocate','/new-construction','/contact','/ny-nj-to-miami','/areas','/market-today','/about','/insights','/privacy','/terms','/cookies']);
const dynamicRoutePatterns=[/^\/properties\/[a-z0-9_-]+$/i,/^\/areas\/[a-z0-9-]+$/i,/^\/insights\/[a-z0-9-]+$/i,/^\/admin(?:\/.*)?$/i];

if(env.TRUST_PROXY)app.set('trust proxy',env.TRUST_PROXY);
app.disable('x-powered-by');
app.use(pinoHttp({logger,genReqId:(req,res)=>{const id=req.headers['x-request-id']||crypto.randomUUID();res.setHeader('x-request-id',id);return id}}));
app.use(helmet({
  contentSecurityPolicy:isProduction?{directives:{
    defaultSrc:["'self'"],baseUri:["'self'"],fontSrc:["'self'",'https://fonts.gstatic.com','data:'],formAction:["'self'"],frameAncestors:["'none'"],frameSrc:["'self'",'https://www.openstreetmap.org'],imgSrc:["'self'",'data:','blob:','https:'],objectSrc:["'none'"],scriptSrc:["'self'",'https://www.googletagmanager.com'],styleSrc:["'self'","'unsafe-inline'",'https://fonts.googleapis.com'],connectSrc:["'self'",'https://www.google-analytics.com','https://region1.google-analytics.com'],upgradeInsecureRequests:[],
  }}:false,
  crossOriginResourcePolicy:{policy:'cross-origin'},
  referrerPolicy:{policy:'strict-origin-when-cross-origin'},
}));
app.use(cors({origin(origin,callback){const normalized=origin?.replace(/\/$/,'');if(!origin||allowedOrigins.includes(normalized))return callback(null,true);return callback(new ApiError(403,'Origin not allowed','ORIGIN_NOT_ALLOWED'))},credentials:true,methods:['GET','POST','PATCH','DELETE','OPTIONS'],allowedHeaders:['Content-Type','Authorization','X-Request-Id']}));
app.use(compression());
app.use(express.json({limit:'250kb'}));
app.use(express.urlencoded({extended:false,limit:'50kb'}));
app.use(cookieParser());

app.use('/api/v1',routes);
app.use('/api/v1',notFound);

if(isProduction&&existsSync(path.join(clientDist,'index.html'))){
  app.use(express.static(clientDist,{index:false,redirect:false,setHeaders(res,filePath){
    if(filePath.includes(`${path.sep}assets${path.sep}`))res.setHeader('Cache-Control','public, max-age=31536000, immutable');
    else if(/\.(?:png|jpe?g|webp|avif|svg|woff2?)$/i.test(filePath))res.setHeader('Cache-Control','public, max-age=604800, stale-while-revalidate=86400');
    else res.setHeader('Cache-Control','public, max-age=3600, must-revalidate');
  }}));
  app.use((req,res,next)=>{
    if(req.method!=='GET'&&req.method!=='HEAD')return next();
    const requestPath=req.path.length>1?req.path.replace(/\/$/,''):req.path;
    const validRoute=publicRoutes.has(requestPath)||dynamicRoutePatterns.some(pattern=>pattern.test(requestPath));
    const noindex=requestPath.startsWith('/admin')||requestPath.startsWith('/insights')||/^\/areas\/[^/]+\/?$/.test(requestPath)||['/privacy','/terms','/cookies','/market-today'].includes(requestPath)||(requestPath==='/properties'&&Object.keys(req.query).length>0);
    if(noindex)res.setHeader('X-Robots-Tag','noindex, nofollow');
    res.setHeader('Cache-Control','no-cache, no-store, must-revalidate');
    const prerendered=requestPath==='/'?path.join(clientDist,'index.html'):path.join(clientDist,requestPath.slice(1),'index.html');
    const fallback=path.join(clientDist,'index.html');
    return res.status(validRoute?200:404).sendFile(existsSync(prerendered)?prerendered:fallback);
  });
}

app.use(notFound);
app.use(errorHandler);

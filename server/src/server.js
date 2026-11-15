import { app } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import { env, isProduction } from './config/env.js';
import { logger } from './config/logger.js';

try{await connectDatabase()}catch(err){logger.fatal({err},'MongoDB connection failed');if(isProduction)process.exit(1)}
const server=app.listen(env.PORT,'0.0.0.0',()=>logger.info({port:env.PORT,environment:env.NODE_ENV},'Ruhan Realty application listening'));
const shutdown=(signal)=>{logger.info({signal},'Shutting down');server.close(async()=>{await disconnectDatabase().catch(err=>logger.error({err},'MongoDB shutdown failed'));process.exit(0)});setTimeout(()=>process.exit(1),10000).unref()};
process.on('SIGTERM',()=>shutdown('SIGTERM'));
process.on('SIGINT',()=>shutdown('SIGINT'));

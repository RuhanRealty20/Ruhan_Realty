import { app } from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

await connectDatabase().catch(err=>logger.error({err},'MongoDB connection failed; continuing in degraded mode'));
const server=app.listen(env.PORT,()=>logger.info({port:env.PORT,environment:env.NODE_ENV},'Ruhan Realty API listening'));
const shutdown=(signal)=>{logger.info({signal},'Shutting down');server.close(()=>process.exit(0));setTimeout(()=>process.exit(1),10000).unref()};process.on('SIGTERM',()=>shutdown('SIGTERM'));process.on('SIGINT',()=>shutdown('SIGINT'));

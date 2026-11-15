import mongoose from 'mongoose';
import { env, isProduction } from './env.js';
import { logger } from './logger.js';

export async function connectDatabase(){if(!env.MONGODB_URI||env.MONGODB_URI.includes('username:password')){if(isProduction)throw new Error('MongoDB is required in production');logger.warn('MongoDB not configured; API starts in degraded mode');return false}mongoose.set('strictQuery',true);await mongoose.connect(env.MONGODB_URI,{serverSelectionTimeoutMS:10000,maxPoolSize:10,minPoolSize:isProduction?1:0,maxIdleTimeMS:30000});logger.info('MongoDB connected');return true}
export const databaseReady=()=>mongoose.connection.readyState===1;
export const disconnectDatabase=()=>mongoose.connection.readyState?mongoose.disconnect():Promise.resolve();

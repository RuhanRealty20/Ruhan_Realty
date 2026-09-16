import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';

export async function connectDatabase(){if(!env.MONGODB_URI||env.MONGODB_URI.includes('username:password')){logger.warn('MongoDB not configured; API starts in degraded mode');return false}mongoose.set('strictQuery',true);await mongoose.connect(env.MONGODB_URI,{serverSelectionTimeoutMS:8000,maxPoolSize:10});logger.info('MongoDB connected');return true}
export const databaseReady=()=>mongoose.connection.readyState===1;

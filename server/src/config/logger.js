import pino from 'pino';
import { env } from './env.js';
export const logger=pino({level:env.LOG_LEVEL,redact:{paths:['req.headers.authorization','req.headers.cookie','res.headers.set-cookie','req.body.password','req.body.token','password','token','*.password','*.passwordHash','*.token','*.tokenHash','*.apiKey'],censor:'[REDACTED]'}});

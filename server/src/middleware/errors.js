import { ZodError } from 'zod';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { ApiError } from '../utils/api.js';

export function notFound(req,_res,next){next(new ApiError(404,`Route ${req.method} ${req.originalUrl} not found`,'NOT_FOUND'))}
export function errorHandler(err,req,res,_next){const status=err instanceof ZodError?400:err.status||500;const message=status===500&&env.NODE_ENV==='production'?'Unexpected server error':err instanceof ZodError?'Validation failed':err.message;logger[status>=500?'error':'warn']({err,requestId:req.id},message);res.status(status).json({success:false,error:{code:err instanceof ZodError?'VALIDATION_ERROR':err.code||'SERVER_ERROR',message,...(err instanceof ZodError?{details:err.issues.map(i=>({path:i.path.join('.'),message:i.message}))}:err.details?{details:err.details}:{})}})}

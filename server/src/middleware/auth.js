import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { ApiError, asyncHandler } from '../utils/api.js';

export const requireAuth=asyncHandler(async(req,_res,next)=>{const token=req.headers.authorization?.startsWith('Bearer ')?req.headers.authorization.slice(7):null;if(!token)throw new ApiError(401,'Authentication required','AUTH_REQUIRED');let payload;try{payload=jwt.verify(token,env.JWT_ACCESS_SECRET)}catch{throw new ApiError(401,'Session expired or invalid','INVALID_TOKEN')}const user=await User.findById(payload.sub).select('name email role active');if(!user?.active)throw new ApiError(401,'Account unavailable','ACCOUNT_UNAVAILABLE');req.user=user;next()});
export const requireRole=(...roles)=>(req,_res,next)=>roles.includes(req.user.role)?next():next(new ApiError(403,'Insufficient permissions','FORBIDDEN'));

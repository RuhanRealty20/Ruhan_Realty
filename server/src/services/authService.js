import argon2 from 'argon2';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/api.js';

const digest=(token)=>crypto.createHash('sha256').update(token).digest('hex');
const refreshExpiry=()=>new Date(Date.now()+7*24*60*60*1000);
export const signAccess=(user)=>jwt.sign({sub:user._id.toString(),role:user.role},env.JWT_ACCESS_SECRET,{expiresIn:env.JWT_ACCESS_TTL,issuer:'ruhanrealty-api',audience:'ruhanrealty-admin'});
export const signRefresh=(user)=>jwt.sign({sub:user._id.toString(),nonce:crypto.randomUUID()},env.JWT_REFRESH_SECRET,{expiresIn:env.JWT_REFRESH_TTL,issuer:'ruhanrealty-api',audience:'ruhanrealty-admin'});
export async function login(email,password,context){const user=await User.findOne({email:email.toLowerCase(),active:true}).select('+passwordHash');if(!user||!await argon2.verify(user.passwordHash,password))throw new ApiError(401,'Invalid email or password','INVALID_CREDENTIALS');const accessToken=signAccess(user);const refreshToken=signRefresh(user);user.sessions=user.sessions.filter(s=>s.expiresAt>new Date());user.sessions.push({tokenHash:digest(refreshToken),expiresAt:refreshExpiry(),...context});user.lastLoginAt=new Date();await user.save();return{accessToken,refreshToken,user:{id:user._id,name:user.name,email:user.email,role:user.role}}}
export async function rotateRefresh(token,context){let payload;try{payload=jwt.verify(token,env.JWT_REFRESH_SECRET,{issuer:'ruhanrealty-api',audience:'ruhanrealty-admin'})}catch{throw new ApiError(401,'Invalid refresh session','INVALID_REFRESH')}const user=await User.findById(payload.sub);if(!user?.active)throw new ApiError(401,'Account unavailable','ACCOUNT_UNAVAILABLE');const hash=digest(token);const session=user.sessions.find(s=>s.tokenHash===hash&&s.expiresAt>new Date());if(!session){user.sessions=[];await user.save();throw new ApiError(401,'Refresh reuse detected; sessions revoked','REFRESH_REUSE')}user.sessions=user.sessions.filter(s=>s.tokenHash!==hash&&s.expiresAt>new Date());const next=signRefresh(user);user.sessions.push({tokenHash:digest(next),expiresAt:refreshExpiry(),...context});await user.save();return{accessToken:signAccess(user),refreshToken:next}}
export async function revokeRefresh(token){if(!token)return;try{const payload=jwt.verify(token,env.JWT_REFRESH_SECRET);await User.updateOne({_id:payload.sub},{$pull:{sessions:{tokenHash:digest(token)}}})}catch{/* already invalid */}}
export async function hashPassword(password){return argon2.hash(password,{type:argon2.argon2id,memoryCost:19456,timeCost:2,parallelism:1})}

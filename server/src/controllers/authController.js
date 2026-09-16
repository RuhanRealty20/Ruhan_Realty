import { isProduction } from '../config/env.js';
import { audit } from '../middleware/audit.js';
import { login, revokeRefresh, rotateRefresh } from '../services/authService.js';
import { ApiError, ok } from '../utils/api.js';

const cookieOptions={httpOnly:true,secure:isProduction,sameSite:isProduction?'strict':'lax',path:'/api/v1/auth',maxAge:7*24*60*60*1000};
const context=(req)=>({ip:req.ip,userAgent:req.get('user-agent')});
export async function loginAdmin(req,res){const result=await login(req.body.email,req.body.password,context(req));res.cookie('rr_refresh',result.refreshToken,cookieOptions);await audit({...req,user:{_id:result.user.id}},'AUTH_LOGIN','User',result.user.id);return ok(res,{accessToken:result.accessToken,user:result.user})}
export async function refreshAdmin(req,res){const token=req.cookies.rr_refresh;if(!token)throw new ApiError(401,'Refresh session required','REFRESH_REQUIRED');const result=await rotateRefresh(token,context(req));res.cookie('rr_refresh',result.refreshToken,cookieOptions);return ok(res,{accessToken:result.accessToken})}
export async function logoutAdmin(req,res){await revokeRefresh(req.cookies.rr_refresh);res.clearCookie('rr_refresh',{...cookieOptions,maxAge:undefined});return ok(res,{loggedOut:true})}

import { AuditLog } from '../models/AuditLog.js';
export async function audit(req,action,entityType,entityId,metadata={}){await AuditLog.create({actor:req.user?._id,action,entityType,entityId:String(entityId||''),metadata,ip:req.ip,userAgent:req.get('user-agent')}).catch(()=>{})}

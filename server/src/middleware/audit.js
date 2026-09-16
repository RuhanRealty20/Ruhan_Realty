import { AuditLog } from '../models/AuditLog.js';

export async function audit(req,action,entityType,entityId,metadata={},actorId=req.user?._id){
  const userAgent=typeof req.get==='function'?req.get('user-agent'):req.headers?.['user-agent'];
  try{
    await AuditLog.create({actor:actorId,action,entityType,entityId:String(entityId||''),metadata,ip:req.ip,userAgent});
  }catch{
    // Audit logging must never turn a successful application action into a 500 response.
  }
}

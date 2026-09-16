import mongoose from 'mongoose';
const auditSchema=new mongoose.Schema({actor:{type:mongoose.Schema.Types.ObjectId,ref:'User'},action:{type:String,required:true,index:true},entityType:String,entityId:String,metadata:mongoose.Schema.Types.Mixed,ip:String,userAgent:String},{timestamps:true});
auditSchema.index({createdAt:-1});
export const AuditLog=mongoose.model('AuditLog',auditSchema);

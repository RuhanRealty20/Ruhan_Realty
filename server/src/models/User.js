import mongoose from 'mongoose';
const sessionSchema=new mongoose.Schema({tokenHash:{type:String,required:true},userAgent:String,ip:String,createdAt:{type:Date,default:Date.now},expiresAt:{type:Date,required:true}},{_id:false});
const userSchema=new mongoose.Schema({name:{type:String,required:true,trim:true},email:{type:String,required:true,unique:true,lowercase:true,index:true},passwordHash:{type:String,required:true,select:false},role:{type:String,enum:['ADMIN','EDITOR'],default:'ADMIN'},active:{type:Boolean,default:true},lastLoginAt:Date,sessions:[sessionSchema]},{timestamps:true});
export const User=mongoose.model('User',userSchema);

import mongoose from 'mongoose';
const seoSchema=new mongoose.Schema({title:String,description:String,noindex:{type:Boolean,default:false}},{_id:false});
const contentSchema=new mongoose.Schema({type:{type:String,enum:['AREA','ARTICLE','TESTIMONIAL','FAQ','LEAD_MAGNET','SITE'],required:true,index:true},title:{type:String,required:true},slug:{type:String,required:true},summary:String,body:String,featuredImage:{url:String,alt:String},source:{name:String,url:String},factualTakeaway:String,publicationDate:Date,seo:seoSchema,status:{type:String,enum:['DRAFT','REVIEW','PUBLISHED','ARCHIVED'],default:'DRAFT',index:true},publishDate:Date,data:mongoose.Schema.Types.Mixed,createdBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'},updatedBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'}},{timestamps:true});
contentSchema.index({type:1,slug:1},{unique:true});contentSchema.index({status:1,publishDate:-1});
export const Content=mongoose.model('Content',contentSchema);

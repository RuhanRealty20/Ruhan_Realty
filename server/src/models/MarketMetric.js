import mongoose from 'mongoose';
const marketMetricSchema=new mongoose.Schema({key:{type:String,required:true,index:true},label:{type:String,required:true},value:{type:mongoose.Schema.Types.Mixed,required:true},displayValue:String,source:{name:{type:String,required:true},url:String},geography:{type:String,required:true},reportingPeriod:{type:String,required:true},observedAt:Date,lastUpdated:{type:Date,required:true},lastSuccessfulAt:{type:Date,required:true},status:{type:String,enum:['CURRENT','STALE','ERROR'],default:'CURRENT'},error:String},{timestamps:true});
marketMetricSchema.index({key:1,geography:1,reportingPeriod:1},{unique:true});
export const MarketMetric=mongoose.model('MarketMetric',marketMetricSchema);

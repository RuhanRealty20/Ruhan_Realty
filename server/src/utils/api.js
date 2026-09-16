export const ok=(res,data,meta)=>res.json({success:true,data,...(meta?{meta}:{})});
export class ApiError extends Error{constructor(status,message,code='REQUEST_ERROR',details){super(message);this.status=status;this.code=code;this.details=details}}
export const asyncHandler=(fn)=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
export const pagination=(query)=>{const page=Math.max(1,Number(query.page)||1);const limit=Math.min(100,Math.max(1,Number(query.limit)||20));return{page,limit,skip:(page-1)*limit}}

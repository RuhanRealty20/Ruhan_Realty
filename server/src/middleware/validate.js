export const validate=(schema,property='body')=>(req,_res,next)=>{req[property]=schema.parse(req[property]);next()};

import { env, geminiApiBase, geminiApiKey } from '../../config/env.js';
import { logger } from '../../config/logger.js';
import { ApiError } from '../../utils/api.js';

const responseSchema={
  type:'OBJECT',required:['reply','shouldSearch','quickReplies'],
  properties:{
    reply:{type:'STRING'},intent:{type:'STRING',enum:['buy','sell','rent','landlord','invest','relocate','new-construction','general']},
    area:{type:'STRING'},propertyType:{type:'STRING'},minPrice:{type:'NUMBER'},maxPrice:{type:'NUMBER'},beds:{type:'NUMBER'},baths:{type:'NUMBER'},timeframe:{type:'STRING'},goal:{type:'STRING'},
    shouldSearch:{type:'BOOLEAN'},quickReplies:{type:'ARRAY',items:{type:'STRING'}},suggestedPath:{type:'STRING'},
    recommendations:{type:'ARRAY',items:{type:'OBJECT',required:['label','path','reason'],properties:{label:{type:'STRING'},path:{type:'STRING'},reason:{type:'STRING'}}}},
  },
};

const wait=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));

export async function generateGeminiResponse({systemInstruction,history,message,profile}){
  const apiKey=geminiApiKey;
  if(!apiKey)throw new ApiError(503,'The AI assistant is not configured yet','AI_NOT_CONFIGURED');
  const url=`${geminiApiBase}/models/${encodeURIComponent(env.GEMINI_MODEL)}:generateContent`;
  const contents=[
    ...history.map(turn=>({role:turn.role==='assistant'?'model':'user',parts:[{text:turn.text}]})),
    {role:'user',parts:[{text:`Current visitor profile: ${JSON.stringify(profile)}\nCurrent page: ${message.page}\nVisitor message: ${message.text}`}]} ,
  ];
  const body={
    system_instruction:{parts:[{text:systemInstruction}]},contents,
    generationConfig:{temperature:.35,maxOutputTokens:700,responseMimeType:'application/json',responseSchema},
    safetySettings:[
      {category:'HARM_CATEGORY_HARASSMENT',threshold:'BLOCK_MEDIUM_AND_ABOVE'},
      {category:'HARM_CATEGORY_HATE_SPEECH',threshold:'BLOCK_MEDIUM_AND_ABOVE'},
      {category:'HARM_CATEGORY_SEXUALLY_EXPLICIT',threshold:'BLOCK_MEDIUM_AND_ABOVE'},
      {category:'HARM_CATEGORY_DANGEROUS_CONTENT',threshold:'BLOCK_MEDIUM_AND_ABOVE'},
    ],
  };
  for(let attempt=0;attempt<3;attempt+=1){
    let response;
    try{
      response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':apiKey},body:JSON.stringify(body),signal:AbortSignal.timeout(18000)});
    }catch(error){
      if(attempt<2&&(error.name==='TimeoutError'||error.name==='AbortError')){await wait(350*(2**attempt));continue}
      throw new ApiError(502,'The assistant is temporarily unavailable. Please try again or contact Ruhan.','AI_UNAVAILABLE');
    }
    if(response.ok){
      const data=await response.json();
      const text=data.candidates?.[0]?.content?.parts?.map(part=>part.text||'').join('').trim();
      if(!text)throw new ApiError(502,'The assistant could not complete that answer','AI_EMPTY_RESPONSE');
      try{return JSON.parse(text)}catch{logger.warn({model:env.GEMINI_MODEL},'Gemini returned non-JSON assistant output');return{reply:text,shouldSearch:false,quickReplies:[]}}
    }
    if((response.status===429||response.status>=500)&&attempt<2){await wait(400*(2**attempt));continue}
    const errorBody=await response.json().catch(()=>({}));
    logger.warn({status:response.status,code:errorBody.error?.code,model:env.GEMINI_MODEL},'Gemini request failed');
    throw new ApiError(502,'The assistant is temporarily unavailable. Please try again or contact Ruhan.','AI_UNAVAILABLE');
  }
  throw new ApiError(502,'The assistant is temporarily unavailable','AI_UNAVAILABLE');
}

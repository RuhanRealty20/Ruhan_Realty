import { env } from '../config/env.js';
import { assistantKnowledge } from '../data/assistantKnowledge.js';
import { generateGeminiResponse } from '../integrations/ai/gemini.js';
import { idxProvider } from '../integrations/idx/index.js';

const allowedPaths=new Set(['/properties','/buy','/sell','/rent','/landlord','/invest','/relocate','/ny-nj-to-miami','/new-construction','/areas','/market-today','/about','/contact']);
const profileKeys=['intent','area','propertyType','minPrice','maxPrice','beds','baths','timeframe','goal'];
const areas=['Brickell','Downtown Miami','Miami Beach','South Beach','Edgewater','Coconut Grove','Coral Gables','Key Biscayne','Fisher Island','Sunny Isles','Bal Harbour','Aventura','North Miami Beach','Fort Lauderdale'];

function fallbackResponse(message,profile){
  const lower=message.toLowerCase();
  const next={...profile};
  const area=areas.find(value=>lower.includes(value.toLowerCase()));if(area)next.area=area;
  const propertyTypes=[['condo','Condo'],['townhouse','Townhouse'],['single-family','Single-family home'],['single family','Single-family home'],['apartment','Apartment'],['penthouse','Penthouse']];const propertyType=propertyTypes.find(([term])=>lower.includes(term));if(propertyType)next.propertyType=propertyType[1];
  const beds=lower.match(/\b(\d{1,2})\s*(?:bed|bedroom)/);if(beds)next.beds=Number(beds[1]);
  const budget=lower.match(/(?:under|up to|max(?:imum)?|budget(?:\s+is|\s+of)?)[\s:$]*([\d,.]+)\s*(m|million|k|thousand)?/i);if(budget){const base=Number(budget[1].replaceAll(',',''));const unit=budget[2]?.toLowerCase();next.maxPrice=Math.round(base*(unit==='m'||unit==='million'?1000000:unit==='k'||unit==='thousand'?1000:1))}
  if(/\b(rent|rental|lease)\b/.test(lower))next.intent='rent';else if(/\b(sell|cma|valuation)\b/.test(lower))next.intent='sell';else if(/\b(invest|investment)\b/.test(lower))next.intent='invest';else if(/\b(relocat|moving|move to miami)\b/.test(lower))next.intent='relocate';else if(/\b(buy|purchase|home|condo|property|listing)\b/.test(lower))next.intent='buy';
  const shouldSearch=/\b(property|properties|listing|listings|condo|home|homes|rentals?)\b/.test(lower)&&['buy','rent','invest','new-construction'].includes(next.intent);
  if(/contact|phone|email|whatsapp/.test(lower))return{reply:'You can reach Ruhan directly at 407-840-2959, on WhatsApp at the same number, or by email at rsyed@bhsusa.com. Ruhan is a Realtor Associate with Brown Harris Stevens, Miami Beach.',profile:next,shouldSearch:false,quickReplies:['Open contact page','WhatsApp Ruhan'],suggestedPath:'/contact'};
  if(!next.intent)return{reply:'I can help you find the right next step for buying, selling, renting, investing or relocating in Miami. What brings you here today?',profile:next,shouldSearch:false,quickReplies:['Buy a home','Rent a property','Sell my property','Relocate to Miami'],suggestedPath:'/contact'};
  if(shouldSearch&&!next.area)return{reply:`I can help focus your ${next.intent} search using the approved property feed. Which Miami or South Florida area are you considering?`,profile:next,shouldSearch:false,quickReplies:['Brickell','Miami Beach','Coconut Grove','Aventura'],suggestedPath:'/properties'};
  return{reply:'Thanks—that gives me a useful starting point. Share your approximate budget, preferred property type and timing, or ask me any question about Ruhan-Realty and the services available here.',profile:next,shouldSearch,quickReplies:['Under $1M','$1M–$2M','Condo','Talk to Ruhan'],suggestedPath:next.intent==='sell'?'/sell':`/${next.intent}`};
}

function mergeProfile(current,result){const merged={...current};for(const key of profileKeys){const value=result[key];if(value!==undefined&&value!==null&&value!=='')merged[key]=value}return merged}
function normalizeProperty(item){
  if(!item||!item.slug)return null;
  return{id:String(item.id||item.slug),slug:item.slug,title:item.title||item.address||'Miami property',location:item.location||item.address||'',price:item.price||'',beds:item.beds,baths:item.baths,type:item.type||'',image:item.image||'',imageAlt:item.imageAlt||'',status:item.status||'',url:`/properties/${encodeURIComponent(item.slug)}`,attribution:item.attribution||'Listing attribution supplied by the approved IDX provider.'};
}

export async function chatWithAssistant(input){
  let result;
  if(env.AI_PROVIDER==='gemini'&&(env.GEMINI_API_KEY||env.AI_API_KEY)){
    try{result=await generateGeminiResponse({systemInstruction:assistantKnowledge,history:input.history,message:{text:input.message,page:input.page},profile:input.profile})}
    catch{result=fallbackResponse(input.message,input.profile);result.providerStatus='temporarily-unavailable'}
  }else result=fallbackResponse(input.message,input.profile);
  const profile=result.profile||mergeProfile(input.profile,result);
  const shouldSearch=Boolean(result.shouldSearch)&&['buy','rent','invest','new-construction'].includes(profile.intent);
  let properties=[];let idxStatus='not-requested';
  if(shouldSearch){
    try{
      const search=await idxProvider.search({status:profile.intent==='rent'?'For Rent':profile.intent==='new-construction'?'New Construction':'For Sale',location:profile.area||'',minPrice:profile.minPrice||'',maxPrice:profile.maxPrice||'',propertyType:profile.propertyType||'',beds:profile.beds||'',baths:profile.baths||'',limit:3});
      idxStatus=search.providerStatus||'connected';properties=(search.items||[]).slice(0,3).map(normalizeProperty).filter(Boolean);
      if(idxStatus==='unconfigured')result.reply=`${result.reply} The approved MLS/IDX feed is not connected yet, so I will not invent listings or prices. Ruhan can run an authorized search for you.`;
      else if(properties.length)result.reply=`${result.reply} I found ${properties.length} current match${properties.length===1?'':'es'} from the approved property feed below.`;
      else result.reply=`${result.reply} I did not find an authorized match with those filters. Adjust the search or ask Ruhan for a focused search.`;
    }catch{idxStatus='temporarily-unavailable';result.reply=`${result.reply} The approved property feed is temporarily unavailable. I will not substitute unverified listings; Ruhan can help with a current search.`}
  }
  const suggestedPath=allowedPaths.has(result.suggestedPath)?result.suggestedPath:(shouldSearch?'/properties':'/contact');
  return{reply:String(result.reply||'How can I help with your Miami real-estate plans?').slice(0,2400),profile,quickReplies:Array.isArray(result.quickReplies)?result.quickReplies.filter(v=>typeof v==='string').slice(0,4):[],suggestedPath,properties,idxStatus,aiStatus:env.AI_PROVIDER==='gemini'&&(env.GEMINI_API_KEY||env.AI_API_KEY)?(result.providerStatus||'connected'):'guided-fallback',disclaimer:'AI can make mistakes. Listing details require approved IDX verification. For legal, tax, mortgage or financial advice, consult an appropriately licensed professional.'};
}

import { databaseReady } from '../config/db.js';
import { logger } from '../config/logger.js';
import { assistantKnowledge } from '../data/assistantKnowledge.js';
import { Content } from '../models/Content.js';

let cache={value:assistantKnowledge,expiresAt:0};
const clean=(value,max=1200)=>String(value||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().slice(0,max);

export async function getAssistantKnowledge(){
  if(!databaseReady())return assistantKnowledge;
  if(cache.expiresAt>Date.now())return cache.value;
  try{
    const items=await Content.find({status:'PUBLISHED',publishDate:{$lte:new Date()}}).select('type title slug summary body factualTakeaway source').sort({publishDate:-1}).limit(40).lean();
    const published=items.map(item=>[
      `TYPE: ${item.type}`,
      `TITLE: ${clean(item.title,180)}`,
      `WEBSITE PATH: ${item.type==='AREA'?`/areas/${item.slug}`:item.type==='ARTICLE'?`/insights/${item.slug}`:''}`,
      item.summary?`SUMMARY: ${clean(item.summary,500)}`:'',
      item.body?`APPROVED CONTENT: ${clean(item.body)}`:'',
      item.factualTakeaway?`RUHAN'S REVIEWED TAKEAWAY: ${clean(item.factualTakeaway,600)}`:'',
      item.source?.name?`SOURCE: ${clean(item.source.name,160)}${item.source.url?` (${clean(item.source.url,500)})`:''}`:'',
    ].filter(Boolean).join('\n')).join('\n\n');
    cache={value:`${assistantKnowledge}\n\nPUBLISHED CMS CONTENT (approved for public answers):\n${published||'No additional published CMS content is available.'}`,expiresAt:Date.now()+5*60*1000};
    return cache.value;
  }catch(error){logger.warn({err:error},'Could not load published assistant knowledge');return assistantKnowledge}
}

import { z } from 'zod';

const profileSchema=z.object({
  intent:z.enum(['buy','sell','rent','landlord','invest','relocate','new-construction','general']).optional(),
  area:z.string().trim().max(120).optional(),propertyType:z.string().trim().max(120).optional(),
  minPrice:z.coerce.number().min(0).max(500000000).optional(),maxPrice:z.coerce.number().min(0).max(500000000).optional(),
  beds:z.coerce.number().min(0).max(30).optional(),baths:z.coerce.number().min(0).max(30).optional(),
  timeframe:z.string().trim().max(120).optional(),goal:z.string().trim().max(240).optional(),
}).strict();

export const assistantChatSchema=z.object({
  message:z.string().trim().min(1).max(1500),
  history:z.array(z.object({role:z.enum(['user','assistant']),text:z.string().trim().min(1).max(1800)}).strict()).max(12).default([]),
  profile:profileSchema.default({}),page:z.string().trim().max(500).default('/'),sessionId:z.string().trim().max(100).optional(),
}).strict();

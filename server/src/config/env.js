import 'dotenv/config';
import { z } from 'zod';

const schema=z.object({
  NODE_ENV:z.enum(['development','test','production']).default('development'),
  PORT:z.coerce.number().int().positive().default(5000),
  MONGODB_URI:z.string().default(''),
  FRONTEND_URL:z.string().url().default('http://localhost:5173'),
  ALLOWED_ORIGINS:z.string().default('http://localhost:5173'),
  JWT_ACCESS_SECRET:z.string().min(32).default('development-access-secret-change-me-123456'),
  JWT_REFRESH_SECRET:z.string().min(32).default('development-refresh-secret-change-me-12345'),
  JWT_ACCESS_TTL:z.string().default('15m'),
  JWT_REFRESH_TTL:z.string().default('7d'),
  COOKIE_DOMAIN:z.string().default(''),
  EMAIL_PROVIDER:z.enum(['console','smtp']).default('console'),
  EMAIL_FROM:z.string().default(''),
  LEAD_NOTIFICATION_EMAIL:z.string().default(''),
  SMTP_HOST:z.string().default(''),
  SMTP_PORT:z.coerce.number().int().positive().default(587),
  SMTP_USER:z.string().default(''),
  SMTP_PASSWORD:z.string().default(''),
  SMS_PROVIDER:z.string().default('disabled'),
  WHATSAPP_PROVIDER:z.string().default('disabled'),
  IDX_PROVIDER:z.string().default('unconfigured'),
  IDX_API_URL:z.string().default(''),
  IDX_API_KEY:z.string().default(''),
  ANALYTICS_PROVIDER:z.string().default('client'),
  AI_PROVIDER:z.enum(['disabled','gemini']).default('disabled'),
  AI_API_KEY:z.string().default(''),
  GEMINI_API_KEY:z.string().default(''),
  GEMINI_MODEL:z.string().default('gemini-3.8-flash'),
  GEMINI_API_BASE:z.string().default('https://generativelanguage.googleapis.com/v1beta'),
  LOG_LEVEL:z.string().default('info'),
  TRUST_PROXY:z.coerce.number().int().min(0).default(0),
}).superRefine((value,context)=>{
  if(value.NODE_ENV!=='production')return;
  const required=[['MONGODB_URI',value.MONGODB_URI],['JWT_ACCESS_SECRET',value.JWT_ACCESS_SECRET],['JWT_REFRESH_SECRET',value.JWT_REFRESH_SECRET]];
  required.forEach(([name,current])=>{
    if(!current||current.includes('username:password')||current.startsWith('development-'))context.addIssue({code:'custom',path:[name],message:`${name} must be configured for production`});
  });
  if(value.JWT_ACCESS_SECRET===value.JWT_REFRESH_SECRET)context.addIssue({code:'custom',path:['JWT_REFRESH_SECRET'],message:'Access and refresh secrets must be different'});
  if(value.EMAIL_PROVIDER==='smtp'){
    [['EMAIL_FROM',value.EMAIL_FROM],['LEAD_NOTIFICATION_EMAIL',value.LEAD_NOTIFICATION_EMAIL],['SMTP_HOST',value.SMTP_HOST],['SMTP_USER',value.SMTP_USER],['SMTP_PASSWORD',value.SMTP_PASSWORD]].forEach(([name,current])=>{
      if(!current)context.addIssue({code:'custom',path:[name],message:`${name} is required when EMAIL_PROVIDER=smtp`});
    });
  }
  if(value.IDX_PROVIDER.toLowerCase()==='bridge'&&(!value.IDX_API_URL||!value.IDX_API_KEY))context.addIssue({code:'custom',path:['IDX_API_KEY'],message:'IDX_API_URL and IDX_API_KEY are required when IDX_PROVIDER=bridge'});
  if(value.AI_PROVIDER==='gemini'&&!(value.GEMINI_API_KEY||value.AI_API_KEY))context.addIssue({code:'custom',path:['GEMINI_API_KEY'],message:'GEMINI_API_KEY is required when AI_PROVIDER=gemini'});
});

export const env=schema.parse(process.env);
export const isProduction=env.NODE_ENV==='production';
export const allowedOrigins=env.ALLOWED_ORIGINS.split(',').map(value=>value.trim().replace(/\/$/, '')).filter(Boolean);
const defaultGeminiBase='https://generativelanguage.googleapis.com/v1beta';
const baseLooksLikeUrl=env.GEMINI_API_BASE.startsWith('https://');
export const geminiApiBase=baseLooksLikeUrl?env.GEMINI_API_BASE:defaultGeminiBase;
export const geminiApiKey=env.GEMINI_API_KEY||env.AI_API_KEY||(!baseLooksLikeUrl&&env.GEMINI_API_BASE.length>30?env.GEMINI_API_BASE:'');

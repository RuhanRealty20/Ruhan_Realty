import 'dotenv/config';
import { z } from 'zod';

const schema=z.object({NODE_ENV:z.enum(['development','test','production']).default('development'),PORT:z.coerce.number().default(5000),MONGODB_URI:z.string().default(''),FRONTEND_URL:z.string().url().default('http://localhost:5173'),ALLOWED_ORIGINS:z.string().default('http://localhost:5173'),JWT_ACCESS_SECRET:z.string().min(32).default('development-access-secret-change-me-123456'),JWT_REFRESH_SECRET:z.string().min(32).default('development-refresh-secret-change-me-12345'),JWT_ACCESS_TTL:z.string().default('15m'),JWT_REFRESH_TTL:z.string().default('7d'),COOKIE_DOMAIN:z.string().default(''),EMAIL_PROVIDER:z.string().default('console'),EMAIL_FROM:z.string().default(''),LEAD_NOTIFICATION_EMAIL:z.string().default(''),SMTP_HOST:z.string().default(''),SMTP_PORT:z.coerce.number().default(587),SMTP_USER:z.string().default(''),SMTP_PASSWORD:z.string().default(''),IDX_PROVIDER:z.string().default('unconfigured'),IDX_API_URL:z.string().default(''),IDX_API_KEY:z.string().default(''),AI_PROVIDER:z.enum(['disabled','gemini']).default('disabled'),AI_API_KEY:z.string().default(''),GEMINI_API_KEY:z.string().default(''),GEMINI_MODEL:z.string().default('gemini-3.8-flash'),GEMINI_API_BASE:z.string().default('https://generativelanguage.googleapis.com/v1beta'),LOG_LEVEL:z.string().default('info'),TRUST_PROXY:z.coerce.number().default(0)});
export const env=schema.parse(process.env);
if(env.NODE_ENV==='production'&&(env.JWT_ACCESS_SECRET.startsWith('development-')||env.JWT_REFRESH_SECRET.startsWith('development-'))){throw new Error('Production requires independent strong JWT_ACCESS_SECRET and JWT_REFRESH_SECRET values')}
export const isProduction=env.NODE_ENV==='production';
export const allowedOrigins=env.ALLOWED_ORIGINS.split(',').map(v=>v.trim()).filter(Boolean);
const defaultGeminiBase='https://generativelanguage.googleapis.com/v1beta';
const baseLooksLikeUrl=env.GEMINI_API_BASE.startsWith('https://');
export const geminiApiBase=baseLooksLikeUrl?env.GEMINI_API_BASE:defaultGeminiBase;
export const geminiApiKey=env.GEMINI_API_KEY||env.AI_API_KEY||(!baseLooksLikeUrl&&env.GEMINI_API_BASE.length>30?env.GEMINI_API_BASE:'');

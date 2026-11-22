import 'dotenv/config';
import { z } from 'zod';
const schema=z.object({NODE_ENV:z.enum(['development','test','production']).default('development'),PORT:z.coerce.number().int().positive().default(4000),DATABASE_URL:z.string().min(1),REDIS_URL:z.string().min(1),JWT_SECRET:z.string().min(32),JWT_ISSUER:z.string().default('heritage-loom-api'),CORS_ORIGINS:z.string().min(1),EMAIL_PROVIDER:z.enum(['stub','smtp']).default('stub'),REFRESH_COOKIE_NAME:z.string().default('heritage_refresh'),REFRESH_COOKIE_DOMAIN:z.string().optional().or(z.literal(''))});
export const env=schema.parse(process.env);
if(env.NODE_ENV==='production'&&env.EMAIL_PROVIDER==='stub') throw new Error('EMAIL_PROVIDER=stub is not allowed in production');
export const corsOrigins=env.CORS_ORIGINS.split(',').map(x=>x.trim()).filter(Boolean);

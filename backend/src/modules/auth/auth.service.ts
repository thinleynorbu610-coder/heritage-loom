import argon2 from 'argon2';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma.js';
import { redis } from '../../lib/redis.js';
import { env } from '../../config/env.js';
import type { LoginInput, SignupInput } from './auth.schemas.js';
import { StubEmailSender } from './email-sender.js';

const hash=(v:string)=>crypto.createHash('sha256').update(v).digest('hex');
const opaque=()=>crypto.randomBytes(48).toString('base64url');
const objectId=()=>crypto.randomBytes(12).toString('hex');
const normalize=(e:string)=>e.trim().toLowerCase();
const emailer=new StubEmailSender();
export const authEmailer=emailer;
const publicUser=(u:{id:string,email:string,name:string,role:string})=>({id:u.id,email:u.email,name:u.name,role:u.role});
const access=(u:{id:string,role:string})=>jwt.sign({sub:u.id,role:u.role},env.JWT_SECRET,{expiresIn:'15m',issuer:env.JWT_ISSUER});

async function issueRefresh(userId:string,familyId:string=objectId()){const raw=opaque();const row=await prisma.refreshToken.create({data:{userId,familyId,tokenHash:hash(raw),expiresAt:new Date(Date.now()+30*86400000)}});await redis.set(`refresh:${row.id}`,userId,'EX',30*86400).catch(()=>undefined);return raw;}
async function createAuthToken(userId:string,type:'email_verification'|'password_reset'){const raw=opaque();await prisma.authToken.create({data:{userId,tokenHash:hash(raw),type,expiresAt:new Date(Date.now()+86400000)}});return raw;}
export async function signup(input:SignupInput){const email=normalize(input.email);if(await prisma.user.findUnique({where:{normalizedEmail:email}}))return null;const user=await prisma.user.create({data:{email:input.email,normalizedEmail:email,name:input.name,passwordHash:await argon2.hash(input.password,{type:argon2.argon2id})}});await emailer.sendVerification(user.email,await createAuthToken(user.id,'email_verification'));return {accessToken:access(user),user:publicUser(user),refreshToken:await issueRefresh(user.id)};}
export async function login(input:LoginInput){const email=normalize(input.email);const user=await prisma.user.findUnique({where:{normalizedEmail:email}});const valid=user&&user.status==='active'&&await argon2.verify(user.passwordHash,input.password);if(!valid){if(user){const failures=user.failedLoginCount+1;await prisma.user.update({where:{id:user.id},data:{failedLoginCount:failures,lockedUntil:failures>=5?new Date(Date.now()+Math.min(30,failures-4)*60000):null}});}return null;}if(user.lockedUntil&&user.lockedUntil>new Date())return null;await prisma.user.update({where:{id:user.id},data:{failedLoginCount:0,lockedUntil:null}});return {accessToken:access(user),user:publicUser(user),refreshToken:await issueRefresh(user.id)};}
export async function refresh(raw:string){const row=await prisma.refreshToken.findUnique({where:{tokenHash:hash(raw)},include:{user:true}});if(!row||row.expiresAt<new Date()){return null;}if(row.revokedAt){await prisma.refreshToken.updateMany({where:{familyId:row.familyId},data:{revokedAt:new Date()}});return null;}const next=await issueRefresh(row.userId,row.familyId);const nextRow=await prisma.refreshToken.findUnique({where:{tokenHash:hash(next)}});await prisma.refreshToken.update({where:{id:row.id},data:{revokedAt:new Date(),lastUsedAt:new Date(),replacedByTokenId:nextRow?.id}});return {accessToken:access(row.user),user:publicUser(row.user),refreshToken:next};}
export async function logout(raw:string){await prisma.refreshToken.updateMany({where:{tokenHash:hash(raw),revokedAt:null},data:{revokedAt:new Date()}});}
export async function logoutAll(userId:string){await prisma.refreshToken.updateMany({where:{userId,revokedAt:null},data:{revokedAt:new Date()}});}
export async function verifyEmail(raw:string){const token=await prisma.authToken.findUnique({where:{tokenHash:hash(raw)}});if(!token||token.type!=='email_verification'||token.consumedAt||token.expiresAt<new Date())return false;await prisma.$transaction([prisma.authToken.update({where:{id:token.id},data:{consumedAt:new Date()}}),prisma.user.update({where:{id:token.userId},data:{emailVerifiedAt:new Date()}})]);return true;}
export async function requestPasswordReset(emailInput:string){const user=await prisma.user.findUnique({where:{normalizedEmail:normalize(emailInput)}});if(user)await emailer.sendPasswordReset(user.email,await createAuthToken(user.id,'password_reset'));}
export async function resetPassword(raw:string,password:string){const token=await prisma.authToken.findUnique({where:{tokenHash:hash(raw)}});if(!token||token.type!=='password_reset'||token.consumedAt||token.expiresAt<new Date())return false;await prisma.$transaction([prisma.authToken.update({where:{id:token.id},data:{consumedAt:new Date()}}),prisma.user.update({where:{id:token.userId},data:{passwordHash:await argon2.hash(password,{type:argon2.argon2id})}}),prisma.refreshToken.updateMany({where:{userId:token.userId,revokedAt:null},data:{revokedAt:new Date()}})]);return true;}

import rateLimit from 'express-rate-limit';
export const authRateLimit=rateLimit({windowMs:15*60*1000,max:30,standardHeaders:true,legacyHeaders:false,message:{error:{code:'RATE_LIMITED',message:'Too many authentication requests',details:[]}}});

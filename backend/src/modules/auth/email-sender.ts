export type SentEmail={to:string,subject:string,url:string};
export interface EmailSender { sendVerification(to:string,token:string):Promise<void>; sendPasswordReset(to:string,token:string):Promise<void>; }
export class StubEmailSender implements EmailSender { readonly sent:SentEmail[]=[]; async sendVerification(to:string,token:string){this.sent.push({to,subject:'Verify your email',url:`/verify-email?token=${token}`});} async sendPasswordReset(to:string,token:string){this.sent.push({to,subject:'Reset your password',url:`/reset-password?token=${token}`});} }

import nodemailer from 'nodemailer';
import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';

class ConsoleNotifier{async notifyLead(lead){logger.info({leadId:lead._id,intent:lead.intent},'Lead notification (console provider)')}}
class SmtpNotifier{constructor(){this.transport=nodemailer.createTransport({host:env.SMTP_HOST,port:env.SMTP_PORT,secure:env.SMTP_PORT===465,auth:{user:env.SMTP_USER,pass:env.SMTP_PASSWORD}})}async notifyLead(lead){await this.transport.sendMail({from:env.EMAIL_FROM,to:env.LEAD_NOTIFICATION_EMAIL,subject:`New ${lead.intent} lead: ${lead.name}`,text:`${lead.name}\n${lead.email||''}\n${lead.phone||''}\n${lead.budget||''}\n${lead.location||''}\nLead ID: ${lead._id}`})}}
export const notifier=env.EMAIL_PROVIDER==='smtp'&&env.SMTP_HOST?new SmtpNotifier():new ConsoleNotifier();

// SMS and WhatsApp implementations intentionally plug in here later. Keep provider credentials server-side.
export const messagingRouter={async route(_lead){return{sms:process.env.SMS_PROVIDER||'disabled',whatsapp:process.env.WHATSAPP_PROVIDER||'disabled'}}};

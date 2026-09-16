import 'dotenv/config';
import { connectDatabase } from '../src/config/db.js';
import { User } from '../src/models/User.js';
import { hashPassword } from '../src/services/authService.js';
const {ADMIN_EMAIL,ADMIN_INITIAL_PASSWORD}=process.env;
if(!ADMIN_EMAIL||!ADMIN_INITIAL_PASSWORD||ADMIN_INITIAL_PASSWORD.length<14)throw new Error('Set ADMIN_EMAIL and ADMIN_INITIAL_PASSWORD (14+ characters) in server/.env');
await connectDatabase();const existing=await User.findOne({email:ADMIN_EMAIL.toLowerCase()});if(existing)throw new Error('Admin already exists; use a dedicated password reset flow');await User.create({name:'Ruhan Syed',email:ADMIN_EMAIL.toLowerCase(),passwordHash:await hashPassword(ADMIN_INITIAL_PASSWORD),role:'ADMIN'});console.log('Admin created. Remove ADMIN_INITIAL_PASSWORD from the environment.');process.exit(0);

import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { loginAdmin,logoutAdmin,refreshAdmin } from '../controllers/authController.js';
import { asyncHandler } from '../utils/api.js';
import { validate } from '../middleware/validate.js';
import { loginSchema } from '../validators/auth.js';
const router=Router();const loginLimiter=rateLimit({windowMs:15*60*1000,limit:8,standardHeaders:'draft-8',legacyHeaders:false,message:{success:false,error:{code:'RATE_LIMITED',message:'Too many login attempts. Try again later.'}}});
router.post('/login',loginLimiter,validate(loginSchema),asyncHandler(loginAdmin));router.post('/refresh',asyncHandler(refreshAdmin));router.post('/logout',asyncHandler(logoutAdmin));export default router;

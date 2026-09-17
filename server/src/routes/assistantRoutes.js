import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { chat } from '../controllers/assistantController.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/api.js';
import { assistantChatSchema } from '../validators/assistant.js';

const router=Router();
const assistantLimiter=rateLimit({windowMs:15*60*1000,limit:30,standardHeaders:'draft-8',legacyHeaders:false,message:{success:false,error:{code:'RATE_LIMITED',message:'You have sent several messages. Please wait a little or contact Ruhan directly.'}}});
router.post('/chat',assistantLimiter,validate(assistantChatSchema),asyncHandler(chat));
export default router;

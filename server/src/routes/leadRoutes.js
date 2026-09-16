import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as controller from '../controllers/leadController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/api.js';
import { createLeadSchema,noteSchema,updateLeadSchema } from '../validators/lead.js';
const router=Router();const submitLimiter=rateLimit({windowMs:60*60*1000,limit:12,standardHeaders:'draft-8',legacyHeaders:false,message:{success:false,error:{code:'RATE_LIMITED',message:'Too many requests. Please contact Ruhan directly or try later.'}}});
router.post('/',submitLimiter,validate(createLeadSchema),asyncHandler(controller.create));router.use(requireAuth);router.get('/',asyncHandler(controller.list));router.get('/:id',asyncHandler(controller.get));router.patch('/:id',validate(updateLeadSchema),asyncHandler(controller.update));router.post('/:id/notes',validate(noteSchema),asyncHandler(controller.addNote));export default router;

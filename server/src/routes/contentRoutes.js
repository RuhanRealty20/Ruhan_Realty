import { Router } from 'express';
import * as controller from '../controllers/contentController.js';
import { requireAuth,requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../utils/api.js';
const router=Router();router.get('/public/:type',asyncHandler(controller.publicList));router.get('/',requireAuth,asyncHandler(controller.adminList));router.post('/',requireAuth,requireRole('ADMIN','EDITOR'),asyncHandler(controller.save));router.patch('/:id',requireAuth,requireRole('ADMIN','EDITOR'),asyncHandler(controller.save));export default router;

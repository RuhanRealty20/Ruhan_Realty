import { Router } from 'express';
import * as controller from '../controllers/propertyController.js';
import { asyncHandler } from '../utils/api.js';
const router=Router();router.get('/',asyncHandler(controller.list));router.get('/:slug',asyncHandler(controller.get));export default router;

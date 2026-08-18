import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getWorkerList } from '../controllers/user.controller.js';


export const userRoutes = Router();

userRoutes.use(requireAuth);

userRoutes.get('/worker/list', getWorkerList);
// userRoutes.get('/worker/list/:userId', getProfile);

import { Router } from 'express';
import { listTerminology } from '../controllers/terminology.controller.js';

export const terminologyRoutes = Router();

terminologyRoutes.get('/', listTerminology);

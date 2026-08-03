import { Router } from 'express';
import { health } from '../controllers/health.controller.js';
import { authRoutes } from './auth.route.js';
import { terminologyRoutes } from './terminology.route.js';

/**
 * Everything is mounted under /api/v1. Version the surface from day one so a
 * shipped mobile build does not break when web moves forward.
 */
export const v1Routes = Router();

v1Routes.get('/health', health);
v1Routes.use('/auth', authRoutes);
v1Routes.use('/terminology', terminologyRoutes);

// Still to build (22-item register): participants, goals, daily logs,
// snapshots, consent, notifications, audit, exports.

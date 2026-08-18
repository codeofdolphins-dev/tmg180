import { Router } from 'express';
import { health } from '../controllers/health.controller.js';
import { authRoutes } from './auth.route.js';
import { dailyLogRoutes } from './dailyLog.route.js';
import { privacyRoutes } from './privacy.route.js';
import { profileRoutes } from './profile.route.js';
import { snapshotRoutes } from './snapshot.route.js';
import { terminologyRoutes } from './terminology.route.js';
import { userRoutes } from './user.route.js';

/**
 * Everything is mounted under /api/v1. Version the surface from day one so a
 * shipped mobile build does not break when web moves forward.
 */
export const v1Routes = Router();

v1Routes.get('/health', health);
v1Routes.use('/auth', authRoutes);
v1Routes.use('/terminology', terminologyRoutes);
v1Routes.use('/participant', profileRoutes);
v1Routes.use('/participant', dailyLogRoutes);
v1Routes.use('/participant', snapshotRoutes);
v1Routes.use('/participant', privacyRoutes);
v1Routes.use('/user', userRoutes);

// Still to build (22-item register): the worker layer of the daily log and
// snapshot, participant check-ins (M-04), consent, notifications, audit.

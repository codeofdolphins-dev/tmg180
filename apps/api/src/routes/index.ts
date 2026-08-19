import { Router } from 'express';
import { health } from '../controllers/health.controller.js';
import { authRoutes } from './auth.route.js';
import { dailyLogRoutes } from './dailyLog.route.js';
import { directoryRoutes } from './directory.route.js';
import { privacyRoutes } from './privacy.route.js';
import { profileRoutes } from './profile.route.js';
import { sessionPreferencesRoutes } from './sessionPreferences.route.js';
import { snapshotRoutes } from './snapshot.route.js';
import { terminologyRoutes } from './terminology.route.js';
import { workerCredentialsRoutes } from './workerCredentials.route.js';
import { workerDailyLogRoutes } from './workerDailyLog.route.js';
import { workerGovernanceRoutes } from './workerGovernance.route.js';
import { workerLearningRoutes } from './workerLearning.route.js';
import { workerParticipantsRoutes } from './workerParticipants.route.js';
import { workerProfileRoutes } from './workerProfile.route.js';
import { workerSnapshotRoutes } from './workerSnapshot.route.js';

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
v1Routes.use('/participant', sessionPreferencesRoutes);
v1Routes.use('/participant', directoryRoutes);
v1Routes.use('/worker', workerDailyLogRoutes);
v1Routes.use('/worker', workerParticipantsRoutes);
v1Routes.use('/worker', workerCredentialsRoutes);
v1Routes.use('/worker', workerProfileRoutes);
v1Routes.use('/worker', workerGovernanceRoutes);
v1Routes.use('/worker', workerLearningRoutes);
v1Routes.use('/worker', workerSnapshotRoutes);

// Still to build (22-item register): the worker authoring screen over
// /worker/profile, participant check-ins (M-04), consent granting,
// notifications, audit.

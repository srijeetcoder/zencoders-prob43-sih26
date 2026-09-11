import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// SSE Realtime Notification Stream
router.get('/stream', (req, res) => notificationController.streamNotifications(req, res));

// User Notification Management
router.get('/', (req, res, next) => notificationController.getUserNotifications(req, res, next));
router.patch('/read-all', authenticateToken, (req, res, next) => notificationController.markAllRead(req, res, next));
router.post('/mark-all-read', (req, res, next) => notificationController.markAllRead(req, res, next));
router.patch('/:id/read', (req, res, next) => notificationController.markRead(req, res, next));
router.delete('/:id', (req, res, next) => notificationController.dismiss(req, res, next));

export default router;

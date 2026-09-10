import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authLimiter, (req, res, next) => authController.register(req, res, next));
router.post('/login', authLimiter, (req, res, next) => authController.login(req, res, next));
router.post('/refresh', (req, res, next) => authController.refresh(req, res, next));
router.post('/logout', authenticateToken, (req, res, next) => authController.logout(req, res, next));
router.get('/me', authenticateToken, (req, res, next) => authController.me(req, res, next));
router.post('/forgot-password', authLimiter, (req, res, next) => authController.forgotPassword(req, res, next));
router.post('/verify-otp', authLimiter, (req, res, next) => authController.verifyOtp(req, res, next));
router.post('/reset-password', authLimiter, (req, res, next) => authController.resetPassword(req, res, next));

export default router;

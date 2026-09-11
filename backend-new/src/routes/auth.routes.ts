import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

// Authentication
router.post('/register', authLimiter, (req, res, next) => authController.register(req, res, next));
router.post('/login', authLimiter, (req, res, next) => authController.login(req, res, next));
router.post('/oauth/google', authLimiter, (req, res, next) => authController.googleOAuth(req, res, next));
router.post('/google', authLimiter, (req, res, next) => authController.googleOAuth(req, res, next));

// 2-Step OTP Verification (Email and Mobile)
router.post('/otp/send-email', authLimiter, (req, res, next) => authController.sendEmailOtp(req, res, next));
router.post('/request-email-otp', authLimiter, (req, res, next) => authController.sendEmailOtp(req, res, next));

router.post('/otp/verify-email', authLimiter, (req, res, next) => authController.verifyEmailOtp(req, res, next));
router.post('/verify-email-otp', authLimiter, (req, res, next) => authController.verifyEmailOtp(req, res, next));

router.post('/otp/send-mobile', authLimiter, (req, res, next) => authController.sendMobileOtp(req, res, next));
router.post('/request-mobile-otp', authLimiter, (req, res, next) => authController.sendMobileOtp(req, res, next));

router.post('/otp/verify-mobile', authLimiter, (req, res, next) => authController.verifyMobileOtp(req, res, next));
router.post('/verify-mobile-otp', authLimiter, (req, res, next) => authController.verifyMobileOtp(req, res, next));

router.post('/send-otp', authLimiter, (req, res, next) => authController.sendOtp(req, res, next));
router.post('/verify-otp', authLimiter, (req, res, next) => authController.verifyOtp(req, res, next));

// Session & Profile
router.get('/me', authenticateToken, (req, res, next) => authController.me(req, res, next));
router.put('/profile', authenticateToken, (req, res, next) => authController.updateProfile(req, res, next));
router.delete('/account', authenticateToken, (req, res, next) => authController.deleteAccount(req, res, next));
router.post('/refresh', (req, res, next) => authController.refresh(req, res, next));
router.post('/logout', authenticateToken, (req, res, next) => authController.logout(req, res, next));

// Password Recovery
router.post('/forgot-password', authLimiter, (req, res, next) => authController.forgotPassword(req, res, next));
router.post('/reset-password', authLimiter, (req, res, next) => authController.resetPassword(req, res, next));

export default router;

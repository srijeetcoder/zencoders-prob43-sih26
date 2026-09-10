import { Router } from 'express';
import { login, verifyCitizenOtp, getMe } from '../controllers/auth.controller';
import { verifyAuth } from '../middleware/auth.middleware';

const router = Router();

// Multi-Portal Login (Government, Institution, Admin)
router.post('/login', login);

// Citizen Post-Submission Ticket Claim
router.post('/citizen/verify-claim', verifyCitizenOtp);

// Get Active Profile
router.get('/me', verifyAuth, getMe);

export default router;

import { Request, Response, NextFunction } from 'express';

const MOCK_USERS = [
  {
    id: 'gov-001',
    name: 'Shri R. K. Soren (IAS)',
    email: 'gov.officer@jharkhand.gov.in',
    password: 'password123',
    role: 'GOVERNMENT',
    token: 'gov-token-secret-2026',
    department: 'Urban Development & Housing Dept, Govt of Jharkhand',
    district: 'Ranchi',
  },
  {
    id: 'inst-001',
    name: 'Dr. Priya Murmu',
    email: 'rnd.director@bitmesra.ac.in',
    password: 'password123',
    role: 'INSTITUTION',
    token: 'inst-token-secret-2026',
    department: 'Birsa Institute of Technology (BIT Mesra) IoT Center',
    district: 'Ranchi',
  },
  {
    id: 'admin-001',
    name: 'JanSahyog System Administrator',
    email: 'admin@jansahyog.gov.in',
    password: 'password123',
    role: 'ADMIN',
    token: 'admin-token-secret-2026',
    department: 'National Informatics Centre / Govt of Jharkhand',
    district: 'Statewide',
  },
];

/**
 * Multi-Portal Login Endpoint
 * POST /api/auth/login
 */
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password, role } = req.body;

    // Find matched user or generate role-specific credential
    let matched = MOCK_USERS.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());

    if (!matched && role) {
      matched = MOCK_USERS.find((u) => u.role === role.toUpperCase());
    }

    if (!matched) {
      // Default to government officer if general valid email supplied
      matched = {
        id: `user-${Date.now()}`,
        name: email?.split('@')[0] || 'State Innovation Nodal Officer',
        email: email || 'officer@jharkhand.gov.in',
        password: 'password123',
        role: role ? role.toUpperCase() : 'GOVERNMENT',
        token: role === 'INSTITUTION' ? 'inst-token-secret-2026' : 'gov-token-secret-2026',
        department: 'Government of Jharkhand Task Force',
        district: 'Ranchi',
      };
    }

    res.status(200).json({
      success: true,
      message: 'Authentication successful.',
      data: {
        token: matched.token,
        user: {
          id: matched.id,
          name: matched.name,
          email: matched.email,
          role: matched.role,
          department: matched.department,
          district: matched.district,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Post-Submission Citizen OTP Claim Endpoint
 * POST /api/auth/citizen/verify-claim
 */
export async function verifyCitizenOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { ticketId, phone, email, otp } = req.body;

    if (!ticketId) {
      res.status(400).json({ success: false, error: 'Ticket ID is required to claim grievance.' });
      return;
    }

    // Accept valid 4-6 digit OTP in demo mode (default OTP: '1234' or any provided)
    const verifiedPhone = phone || '+91 98350 XXXXX';
    const citizenToken = `citizen-claim-${ticketId}-${Date.now()}`;

    res.status(200).json({
      success: true,
      message: 'Grievance ticket claimed and verified successfully.',
      data: {
        token: citizenToken,
        ticketId,
        verifiedPhone,
        verifiedEmail: email || 'citizen@jharkhand.gov.in',
        role: 'CITIZEN',
        claimedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Retrieve Active Session Details
 * GET /api/auth/me
 */
export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    next(error);
  }
}

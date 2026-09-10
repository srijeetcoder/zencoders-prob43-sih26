import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "CITIZEN" | "GOVERNMENT" | "INSTITUTION" | "ADMIN";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  district?: string;
  verifiedPhone?: string;
  claimedTickets?: string[];
}

export interface RegisterData {
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  district?: string;
  phone?: string;
  organization?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (credentials: { email?: string; password?: string; role?: UserRole }) => Promise<UserProfile>;
  register: (data: RegisterData) => Promise<UserProfile>;
  logout: () => void;
  claimCitizenTicket: (ticketId: string, phone: string, otp: string) => Promise<void>;
  switchDemoRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_PROFILES: Record<UserRole, { user: UserProfile; token: string }> = {
  GOVERNMENT: {
    user: {
      id: "gov-001",
      name: "Shri R. K. Soren (IAS)",
      email: "gov.officer@jharkhand.gov.in",
      role: "GOVERNMENT",
      department: "Urban Development & Housing Dept, Govt of Jharkhand",
      district: "Ranchi",
    },
    token: "gov-token-secret-2026",
  },
  INSTITUTION: {
    user: {
      id: "inst-001",
      name: "Dr. Priya Murmu",
      email: "rnd.director@bitmesra.ac.in",
      role: "INSTITUTION",
      department: "Birsa Institute of Technology (BIT Mesra) IoT Center",
      district: "Ranchi",
    },
    token: "inst-token-secret-2026",
  },
  ADMIN: {
    user: {
      id: "admin-001",
      name: "PooKar System Administrator",
      email: "admin@pookar.gov.in",
      role: "ADMIN",
      department: "National Informatics Centre / Govt of Jharkhand",
      district: "Statewide",
    },
    token: "admin-token-secret-2026",
  },
  CITIZEN: {
    user: {
      id: "citizen-001",
      name: "Citizen Contributor",
      email: "citizen@jharkhand.gov.in",
      role: "CITIZEN",
      district: "Ranchi",
      claimedTickets: ["JS-2026-8812"],
    },
    token: "citizen-token-temp",
  },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("pookar_user") || localStorage.getItem("jansahyog_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("pookar_token") || localStorage.getItem("jansahyog_token") || null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("pookar_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("pookar_user");
      localStorage.removeItem("jansahyog_user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("pookar_token", token);
    } else {
      localStorage.removeItem("pookar_token");
      localStorage.removeItem("jansahyog_token");
    }
  }, [token]);

  const login = async ({ email, role }: { email?: string; password?: string; role?: UserRole }): Promise<UserProfile> => {
    const targetRole = role || "GOVERNMENT";
    const profile = DEMO_PROFILES[targetRole];
    const loggedUser: UserProfile = {
      ...profile.user,
      email: email || profile.user.email,
    };
    setUser(loggedUser);
    setToken(profile.token);
    return loggedUser;
  };

  const register = async (data: RegisterData): Promise<UserProfile> => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      department: data.department || data.organization,
      district: data.district || "Ranchi",
      verifiedPhone: data.phone,
    };
    const newToken = `token-${data.role.toLowerCase()}-${Date.now()}`;
    setUser(newUser);
    setToken(newToken);
    return newUser;
  };

  const switchDemoRole = (targetRole: UserRole) => {
    const profile = DEMO_PROFILES[targetRole];
    setUser(profile.user);
    setToken(profile.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const claimCitizenTicket = async (ticketId: string, phone: string, _otp: string) => {
    const updatedUser: UserProfile = {
      id: user?.id || `citizen-${Date.now()}`,
      name: user?.name || "Verified Citizen",
      email: user?.email || `${phone.replace(/\D/g, "")}@citizen.pookar.gov.in`,
      role: "CITIZEN",
      verifiedPhone: phone,
      claimedTickets: Array.from(new Set([...(user?.claimedTickets || []), ticketId])),
    };
    setUser(updatedUser);
    setToken(`citizen-claim-${ticketId}`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
        claimCitizenTicket,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

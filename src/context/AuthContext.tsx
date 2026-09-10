import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "CITIZEN" | "GOVERNMENT" | "INSTITUTION" | "SUPER_ADMIN" | "ADMIN";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  district?: string;
  phone?: string;
  verifiedPhone?: string;
  institution_id?: string;
  district_id?: string;
  claimedTickets?: string[];
}

export interface RegisterData {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  department?: string;
  district?: string;
  phone?: string;
  organization?: string;
  institution_id?: string;
  district_id?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (credentials: { email?: string; password?: string; role?: UserRole }) => Promise<UserProfile>;
  register: (data: RegisterData) => Promise<UserProfile>;
  logout: () => void;
  claimCitizenTicket: (ticketId: string, claimToken: string) => Promise<void>;
  switchDemoRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api/v1";

const DEMO_PROFILES: Record<string, { user: UserProfile; token: string }> = {
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
  SUPER_ADMIN: {
    user: {
      id: "admin-001",
      name: "PooKar System Administrator",
      email: "admin@pookar.gov.in",
      role: "SUPER_ADMIN",
      department: "National Informatics Centre / Govt of Jharkhand",
      district: "Statewide",
    },
    token: "admin-token-secret-2026",
  },
  ADMIN: {
    user: {
      id: "admin-001",
      name: "PooKar System Administrator",
      email: "admin@pookar.gov.in",
      role: "SUPER_ADMIN",
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
      claimedTickets: ["JS-2026-1001"],
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

  // Verify / Refresh on boot
  useEffect(() => {
    if (token && token.length > 30) {
      fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.success && data.data?.user) {
            setUser(data.data.user);
          }
        })
        .catch(() => {});
    }
  }, []);

  const login = async ({ email, password, role }: { email?: string; password?: string; role?: UserRole }): Promise<UserProfile> => {
    if (email && password) {
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (res.ok && data.success && data.data?.user) {
          setUser(data.data.user);
          setToken(data.data.token);
          return data.data.user;
        }
      } catch (err) {
        console.warn("[Auth Login Fallback] Backend offline, using demo role profile.");
      }
    }

    const targetRole = role || "GOVERNMENT";
    const profile = DEMO_PROFILES[targetRole] || DEMO_PROFILES.GOVERNMENT;
    const loggedUser: UserProfile = {
      ...profile.user,
      email: email || profile.user.email,
    };
    setUser(loggedUser);
    setToken(profile.token);
    return loggedUser;
  };

  const register = async (data: RegisterData): Promise<UserProfile> => {
    if (data.email && data.password) {
      try {
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role,
            phone: data.phone,
            district_id: data.district_id,
            institution_id: data.institution_id,
          }),
        });
        const resData = await res.json();
        if (res.ok && resData.success && resData.data?.user) {
          setUser(resData.data.user);
          setToken(resData.data.token);
          return resData.data.user;
        }
      } catch (err) {
        console.warn("[Auth Register Fallback] Backend offline, creating local profile.");
      }
    }

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
    const profile = DEMO_PROFILES[targetRole] || DEMO_PROFILES.GOVERNMENT;
    setUser(profile.user);
    setToken(profile.token);
  };

  const logout = () => {
    if (token) {
      fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    setUser(null);
    setToken(null);
  };

  const claimCitizenTicket = async (ticketId: string, claimToken: string) => {
    if (token) {
      try {
        await fetch(`${API_BASE}/citizen/grievances/${encodeURIComponent(ticketId)}/claim`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ claimToken }),
        });
      } catch {}
    }

    const updatedUser: UserProfile = {
      id: user?.id || `citizen-${Date.now()}`,
      name: user?.name || "Verified Citizen",
      email: user?.email || `citizen@pookar.gov.in`,
      role: "CITIZEN",
      claimedTickets: Array.from(new Set([...(user?.claimedTickets || []), ticketId])),
    };
    setUser(updatedUser);
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


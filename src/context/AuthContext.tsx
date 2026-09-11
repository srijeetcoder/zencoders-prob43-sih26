import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "../services/api";

export type UserRole = "CITIZEN" | "GOVERNMENT" | "INSTITUTION" | "SUPER_ADMIN" | "ADMIN";
export const UserRole = {
  CITIZEN: "CITIZEN",
  GOVERNMENT: "GOVERNMENT",
  INSTITUTION: "INSTITUTION",
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
} as const;

export type AcademicRole = "STUDENT" | "FACULTY" | "ADMIN";
export const AcademicRole = {
  STUDENT: "STUDENT",
  FACULTY: "FACULTY",
  ADMIN: "ADMIN",
} as const;

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  academicRole?: AcademicRole;
  department?: string;
  district?: string;
  phone?: string;
  verifiedPhone?: string;
  government_id?: string;
  is_email_verified?: boolean;
  is_phone_verified?: boolean;
  logo_url?: string;
  institution_id?: string;
  district_id?: string;
  claimedTickets?: string[];
}

export interface RegisterData {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  academicRole?: AcademicRole;
  department?: string;
  district?: string;
  phone?: string;
  organization?: string;
  government_id?: string;
  institution_id?: string;
  district_id?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (credentials: { email?: string; password?: string; role?: UserRole; academicRole?: AcademicRole }) => Promise<UserProfile>;
  loginWithGoogle: (payload: { credential?: string; role?: UserRole; email?: string; name?: string }) => Promise<UserProfile>;
  register: (data: RegisterData) => Promise<UserProfile>;
  updateProfile: (payload: { name?: string; district?: string }) => Promise<UserProfile>;
  deleteAccount: (password?: string) => Promise<void>;
  logout: () => void;
  claimCitizenTicket: (ticketId: string, claimToken: string) => Promise<void>;
  switchDemoRole: (role: UserRole, academicRole?: AcademicRole) => void;
  setAcademicRole: (role: AcademicRole) => void;
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
      government_id: "JH-RN-8801",
      is_email_verified: true,
      is_phone_verified: true,
    },
    token: "gov-token-secret-2026",
  },
  INSTITUTION: {
    user: {
      id: "inst-001",
      name: "University Stakeholder",
      email: "university@institution.ac.in",
      role: "INSTITUTION",
      academicRole: "STUDENT",
      department: "Innovation & Research Lab",
      district: "Ranchi",
      is_email_verified: true,
      is_phone_verified: true,
    },
    token: "inst-token-session",
  },
  SUPER_ADMIN: {
    user: {
      id: "admin-001",
      name: "PooKar System Administrator",
      email: "admin@pookar.gov.in",
      role: "SUPER_ADMIN",
      department: "National Informatics Centre / Govt of Jharkhand",
      district: "Statewide",
      government_id: "JH-RN-9999",
      is_email_verified: true,
      is_phone_verified: true,
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
      government_id: "JH-RN-9999",
      is_email_verified: true,
      is_phone_verified: true,
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
      is_email_verified: true,
      is_phone_verified: true,
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

  // Synchronize with authoritative /auth/me on mount
  useEffect(() => {
    if (token && token.length > 20) {
      authApi.getMe()
        .then((res: any) => {
          if (res?.user) {
            setUser(res.user);
          } else if (res?.data?.user) {
            setUser(res.data.user);
          }
        })
        .catch(() => {});
    }
  }, [token]);

  const login = async ({
    email,
    password,
    role,
    academicRole,
  }: {
    email?: string;
    password?: string;
    role?: UserRole;
    academicRole?: AcademicRole;
  }): Promise<UserProfile> => {
    // Determine inferred academic role if role is INSTITUTION
    let resolvedAcademicRole = academicRole;
    if (!resolvedAcademicRole && (role === "INSTITUTION" || email?.includes("bitmesra.ac.in") || email?.includes("iit") || email?.includes("nit"))) {
      if (email?.includes("student")) resolvedAcademicRole = "STUDENT";
      else if (email?.includes("admin") || email?.includes("director")) resolvedAcademicRole = "ADMIN";
      else resolvedAcademicRole = "FACULTY";
    }

    if (email && password) {
      try {
        const res: any = await authApi.login({ email, password, role });
        const loggedUser = res.user || res.data?.user || res;
        const loggedToken = res.token || res.data?.token || `token-${Date.now()}`;
        if (loggedUser && loggedUser.id) {
          if (resolvedAcademicRole) {
            loggedUser.academicRole = resolvedAcademicRole;
          }
          setUser(loggedUser);
          setToken(loggedToken);
          return loggedUser;
        }
      } catch (err: any) {
        // If live backend auth throws error in offline dev, create user session from actual credentials
        if (role === "INSTITUTION") {
          const fallbackUser: UserProfile = {
            id: `inst-usr-${Date.now()}`,
            name: email
              ? email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
              : "University Innovator",
            email: email || "user@institution.ac.in",
            role: "INSTITUTION",
            academicRole: resolvedAcademicRole || "STUDENT",
            department: "Academic & Research Department",
            district: "Ranchi",
            is_email_verified: true,
            is_phone_verified: true,
          };
          setUser(fallbackUser);
          setToken(`token-inst-${Date.now()}`);
          return fallbackUser;
        }
        // Propagate real authentication error
        throw err;
      }
    }

    const targetRole = role || "GOVERNMENT";
    const loggedUser: UserProfile = {
      id: `usr-${targetRole.toLowerCase()}-${Date.now()}`,
      name:
        targetRole === "INSTITUTION"
          ? resolvedAcademicRole === "STUDENT"
            ? "Student Innovator"
            : resolvedAcademicRole === "FACULTY"
            ? "Faculty Guide"
            : "Institution Admin"
          : targetRole === "GOVERNMENT"
          ? "Government Officer"
          : "Registered Citizen",
      email: email || `${targetRole.toLowerCase()}@pookar.gov.in`,
      role: targetRole,
      academicRole: resolvedAcademicRole,
      district: "Ranchi",
      is_email_verified: true,
      is_phone_verified: true,
    };
    setUser(loggedUser);
    setToken(`token-${targetRole.toLowerCase()}-${Date.now()}`);
    return loggedUser;
  };

  const loginWithGoogle = async ({ credential, role, email, name }: { credential?: string; role?: UserRole; email?: string; name?: string }): Promise<UserProfile> => {
    try {
      const googleToken = credential || `google-token-${Date.now()}`;
      const res: any = await authApi.googleOAuth({
        token: googleToken,
        credential: googleToken,
        role: role || "CITIZEN",
        email,
        name,
      });

      const loggedUser = res.user || res.data?.user;
      const loggedToken = res.token || res.data?.token;
      if (loggedUser) {
        setUser(loggedUser);
        setToken(loggedToken);
        return loggedUser;
      }
      throw new Error("Invalid response from Google authentication service.");
    } catch (err: any) {
      throw err;
    }
  };

  const register = async (data: RegisterData): Promise<UserProfile> => {
    try {
      const res: any = await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        phone: data.phone,
        district: data.district,
        government_id: data.government_id,
        district_id: data.district_id,
        institution_id: data.institution_id,
        academicRole: data.academicRole,
      });

      const registeredUser = res.user || res.data?.user;
      const registeredToken = res.token || res.data?.token || `token-${data.role.toLowerCase()}-${Date.now()}`;
      if (registeredUser) {
        if (data.academicRole) registeredUser.academicRole = data.academicRole;
        setUser(registeredUser);
        setToken(registeredToken);
        return registeredUser;
      }
    } catch (err: any) {
      throw err;
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      academicRole: data.academicRole,
      department: data.department || data.organization,
      district: data.district || "Ranchi",
      verifiedPhone: data.phone,
      government_id: data.government_id,
      institution_id: data.institution_id,
      is_email_verified: true,
      is_phone_verified: true,
    };
    const newToken = `token-${data.role.toLowerCase()}-${Date.now()}`;
    setUser(newUser);
    setToken(newToken);
    return newUser;
  };

  const updateProfile = async (payload: { name?: string; district?: string }): Promise<UserProfile> => {
    try {
      const res: any = await authApi.updateProfile({
        full_name: payload.name,
        district: payload.district,
      });
      const updated = res.user || res.data?.user || { ...user, name: payload.name || user?.name, district: payload.district || user?.district };
      setUser(updated);
      return updated;
    } catch (err: any) {
      const updated: UserProfile = {
        ...user!,
        name: payload.name || user?.name || "Citizen",
        district: payload.district || user?.district || "Ranchi",
      };
      setUser(updated);
      return updated;
    }
  };

  const deleteAccount = async (password?: string): Promise<void> => {
    try {
      await authApi.deleteAccount(password);
    } finally {
      logout();
    }
  };

  const switchDemoRole = (targetRole: UserRole, targetAcademicRole?: AcademicRole) => {
    const roleUser: UserProfile = {
      id: `usr-${targetRole.toLowerCase()}-${Date.now()}`,
      name:
        targetRole === "INSTITUTION"
          ? targetAcademicRole === "STUDENT"
            ? "Student Innovator"
            : targetAcademicRole === "FACULTY"
            ? "Faculty Guide"
            : "Institution Admin"
          : targetRole === "GOVERNMENT"
          ? "Government Officer"
          : "Registered Citizen",
      email: `${targetRole.toLowerCase()}@pookar.org`,
      role: targetRole,
      academicRole: targetAcademicRole,
      district: "Ranchi",
      is_email_verified: true,
      is_phone_verified: true,
    };
    setUser(roleUser);
    setToken(`token-${targetRole.toLowerCase()}-${Date.now()}`);
  };

  const setAcademicRole = (newRole: AcademicRole) => {
    if (user) {
      const updatedUser: UserProfile = {
        ...user,
        academicRole: newRole,
        role: "INSTITUTION",
      };
      setUser(updatedUser);
    }
  };

  const logout = () => {
    if (token) {
      authApi.logout().catch(() => {});
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
        loginWithGoogle,
        register,
        updateProfile,
        deleteAccount,
        logout,
        claimCitizenTicket,
        switchDemoRole,
        setAcademicRole,
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

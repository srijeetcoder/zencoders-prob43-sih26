import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth, type UserRole } from "../../context/AuthContext";
import { ShieldAlert, Lock, ArrowLeft, LogIn, UserPlus } from "lucide-react";

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  portalName?: string;
}

export default function AuthGuard({ children, allowedRoles, portalName = "Government Service" }: AuthGuardProps) {
  const { user, role, isAuthenticated } = useAuth();

  const isAuthorized = isAuthenticated && role && (allowedRoles.includes(role) || role === "ADMIN");

  if (isAuthorized) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 font-sans text-slate-800">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-8 md:p-10 shadow-xl shadow-slate-900/5 backdrop-blur-xl text-center">
        {/* Soft top gradient */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-72 rounded-full bg-rose-100/60 blur-3xl" />

        <div className="relative mx-auto grid h-20 w-20 place-items-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-600 mb-5 shadow-inner">
          <ShieldAlert className="h-10 w-10 text-rose-600 animate-pulse" />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1 font-mono text-xs font-bold text-rose-700 uppercase tracking-wider">
          <Lock size={13} />
          Access Blocked &bull; Restricted Service
        </div>

        <h2 className="mt-4 text-2xl md:text-3xl font-extrabold tracking-tight text-[#10245e]">
          Government Authorization Required
        </h2>

        <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
          You are currently browsing <span className="text-rose-600 font-semibold">anonymously</span> or without departmental credentials. 
          Access to <span className="text-[#10245e] font-medium">{portalName}</span> is restricted to verified administrators and vetted institutional nodes.
        </p>

        {/* Current status if logged in with wrong role */}
        {user && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 text-left">
            Current Session: <strong>{user.name}</strong> (Role: <span className="font-mono">{user.role}</span>). Required: [{allowedRoles.join(", ")}].
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#148554] px-4 py-3 text-sm font-bold text-white shadow-md shadow-emerald-900/10 hover:bg-[#107046] transition-all hover:-translate-y-0.5"
          >
            <LogIn className="h-4 w-4" />
            Login with Credentials
          </Link>

          <Link
            to="/register"
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all hover:-translate-y-0.5"
          >
            <UserPlus className="h-4 w-4 text-emerald-600" />
            Register Official Node
          </Link>
        </div>

        {/* Back to Home */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-emerald-700 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Return to Public Home
          </Link>
          <span className="font-mono text-[10px]">National Governance Security Shield</span>
        </div>
      </div>
    </div>
  );
}

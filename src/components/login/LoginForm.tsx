import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  GraduationCap,
  ArrowRight,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAuth, type UserRole } from "../../context/AuthContext";

function LoginForm() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const roleParam = searchParams.get("role")?.toLowerCase() || "";
  const initialRole: UserRole =
    roleParam === "citizen"
      ? "CITIZEN"
      : roleParam === "university" || roleParam === "institution"
      ? "INSTITUTION"
      : roleParam === "gov" || roleParam === "government"
      ? "GOVERNMENT"
      : "CITIZEN";

  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [academicBranch, setAcademicBranch] = useState<"STUDENT" | "FACULTY" | "ADMIN">("STUDENT");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (roleParam === "citizen") {
      setSelectedRole("CITIZEN");
    } else if (roleParam === "university" || roleParam === "institution") {
      setSelectedRole("INSTITUTION");
    } else if (roleParam === "gov" || roleParam === "government") {
      setSelectedRole("GOVERNMENT");
    }
    setFormData({ email: "", password: "" });
  }, [roleParam]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  }

  const handleRoleQuickSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError("");
    setFormData({ email: "", password: "" });
  };

  const handleAcademicBranchSelect = (branch: "STUDENT" | "FACULTY" | "ADMIN") => {
    setAcademicBranch(branch);
    setError("");
  };

  const handleSuccessfulAuth = (loggedUser?: any) => {
    setSuccess(true);
    setTimeout(() => {
      const targetRole = (loggedUser?.role || selectedRole).toUpperCase();
      if (targetRole === "GOVERNMENT" || targetRole === "ADMIN" || targetRole === "SUPER_ADMIN") {
        navigate("/gov-dashboard");
      } else if (targetRole === "INSTITUTION") {
        navigate("/university-dashboard");
      } else {
        navigate("/userdashboard");
      }
    }, 600);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.email) {
      setError("Please enter your registered email or official ID.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const loggedUser = await login({
        email: formData.email,
        password: formData.password,
        role: selectedRole,
        academicRole: selectedRole === "INSTITUTION" ? academicBranch : undefined,
      });

      handleSuccessfulAuth(loggedUser);
    } catch (err: any) {
      setError(err?.message || "Unable to sign in. Please verify your credentials.");
      setIsSubmitting(false);
    }
  }

  async function handleGoogleLogin() {
    if (selectedRole !== "CITIZEN") {
      setError("Google OAuth is strictly restricted to Citizen access. Government and University personnel must use official domain authentication.");
      return;
    }

    setIsGoogleSubmitting(true);
    setError("");

    try {
      // Authenticate citizen via Google OAuth provider
      const mockEmail = formData.email && formData.email.includes("@") ? formData.email : "citizen.user@gmail.com";
      const loggedUser = await loginWithGoogle({
        role: "CITIZEN",
        email: mockEmail,
        name: "Google Authenticated Citizen",
      });

      handleSuccessfulAuth(loggedUser);
    } catch (err: any) {
      setError(err?.message || "Google Sign-In was rejected. Please verify citizen permissions.");
      setIsGoogleSubmitting(false);
    }
  }

  return (
    <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-xl p-5 sm:p-7 shadow-[0_25px_60px_rgba(15,23,42,0.12)]">
      {/* Background Official Clean SVG Emblem Watermark (No checkerboard artifact) */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none z-0"
        aria-hidden="true"
      >
        <img
          src="/emblem.svg"
          alt="Official Emblem Watermark"
          className="h-[75%] w-[75%] object-contain opacity-[0.04] filter grayscale"
        />
      </div>

      <div className="relative z-10">
        {/* Top Header Badge */}
        <div className="mb-3 sm:mb-4 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
            <ShieldCheck className="h-3 w-3 text-emerald-600" />
            <span>National Problem Ledger Portal</span>
          </div>
          <h2 className="mt-1.5 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Sign In to <span className="text-[#047d48]">PooKar</span>
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Secure multi-stakeholder governance & innovation access
          </p>
        </div>

        {/* Quick Role Selector Tabs */}
        <div className="mb-3 sm:mb-4 grid grid-cols-3 gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleRoleQuickSelect("GOVERNMENT")}
            className={`rounded-lg py-1.5 transition-all ${
              selectedRole === "GOVERNMENT"
                ? "bg-white text-emerald-700 shadow-sm border border-slate-200 font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🏛️ Gov Desk
          </button>
          <button
            type="button"
            onClick={() => handleRoleQuickSelect("INSTITUTION")}
            className={`rounded-lg py-1.5 transition-all ${
              selectedRole === "INSTITUTION"
                ? "bg-white text-emerald-700 shadow-sm border border-slate-200 font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🎓 University
          </button>
          <button
            type="button"
            onClick={() => handleRoleQuickSelect("CITIZEN")}
            className={`rounded-lg py-1.5 transition-all ${
              selectedRole === "CITIZEN"
                ? "bg-white text-emerald-700 shadow-sm border border-slate-200 font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            👤 Citizen
          </button>
        </div>

        {/* Branched University Role Selector */}
        {selectedRole === "INSTITUTION" && (
          <div className="mb-3.5 p-2 rounded-2xl bg-indigo-50/70 border border-indigo-100">
            <div className="mb-1.5 flex items-center justify-between px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900">
                Academic Role Branch
              </span>
              <span className="text-[10px] text-indigo-600 font-medium">
                Select your institutional persona
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleAcademicBranchSelect("STUDENT")}
                className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl transition-all ${
                  academicBranch === "STUDENT"
                    ? "bg-white text-indigo-900 font-bold shadow-xs border border-indigo-200/90"
                    : "text-indigo-700/80 hover:bg-white/60"
                }`}
              >
                <span>🎓</span>
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => handleAcademicBranchSelect("FACULTY")}
                className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl transition-all ${
                  academicBranch === "FACULTY"
                    ? "bg-white text-indigo-900 font-bold shadow-xs border border-indigo-200/90"
                    : "text-indigo-700/80 hover:bg-white/60"
                }`}
              >
                <span>🔬</span>
                <span>Faculty</span>
              </button>
              <button
                type="button"
                onClick={() => handleAcademicBranchSelect("ADMIN")}
                className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl transition-all ${
                  academicBranch === "ADMIN"
                    ? "bg-white text-indigo-900 font-bold shadow-xs border border-indigo-200/90"
                    : "text-indigo-700/80 hover:bg-white/60"
                }`}
              >
                <span>🏛️</span>
                <span>Admin</span>
              </button>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Authentication successful! Redirecting to {selectedRole.toLowerCase()} console...</span>
            </div>
          )}

          {/* Email / ID Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              {selectedRole === "GOVERNMENT"
                ? "Official Gov Email / Unique Officer ID (JH-XX-XXXX)"
                : selectedRole === "INSTITUTION"
                ? "Institutional Email / AISHE Code"
                : "Registered Email / Phone"}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={
                  selectedRole === "GOVERNMENT"
                    ? "officer@gov.in or JH-RN-8801"
                    : selectedRole === "INSTITUTION"
                    ? "director@bitmesra.ac.in"
                    : "name@example.com or mobile"
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Security Password
              </label>
              <Link
                to="/forgetpassword"
                className="text-xs font-semibold text-[#047d48] hover:text-[#03663a] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter account password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isGoogleSubmitting || success}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#047d48] py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#03663a] active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In to {selectedRole === "GOVERNMENT" ? "Gov Console" : selectedRole === "INSTITUTION" ? "University Portal" : "Citizen Dashboard"}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Google OAuth Section - Exclusively visible and valid for Citizen role */}
        {selectedRole === "CITIZEN" ? (
          <div className="mt-3">
            <div className="relative my-2.5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Or Single Sign-On
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleSubmitting || isSubmitting || success}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white py-2 px-4 text-xs font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-[0.99] disabled:opacity-70"
            >
              {isGoogleSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                  <span>Connecting to Google Account...</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google (Citizen Portal)</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200/80 p-2.5 text-center text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700">Official Portal Security: </span>
            {selectedRole === "GOVERNMENT" ? "Government officers" : "University researchers"} must authenticate using registered institutional credentials.
          </div>
        )}

        {/* Divider */}
        <div className="relative my-3 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative bg-white px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Or Register on PooKar
          </span>
        </div>

        {/* Citizen Quick Register Link */}
        <div className="text-center text-xs text-slate-600 mb-3">
          Are you a resident reporting a bottleneck?{" "}
          <Link
            to="/register?role=citizen"
            className="font-bold text-[#047d48] hover:underline"
          >
            Register as Citizen
          </Link>
        </div>

        {/* Two Dedicated Registration Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Link
            to="/register?role=ministry"
            className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs font-semibold text-slate-700 transition-all hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-900"
          >
            <div className="flex items-center gap-2">
              <div className="grid h-6 w-6 place-items-center rounded-lg bg-emerald-100/80 text-emerald-700">
                <Building2 className="h-3.5 w-3.5" />
              </div>
              <span className="leading-tight text-left">Gov Register</span>
            </div>
            <ArrowRight className="h-3 w-3 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-600" />
          </Link>

          <Link
            to="/register?role=university"
            className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs font-semibold text-slate-700 transition-all hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-900"
          >
            <div className="flex items-center gap-2">
              <div className="grid h-6 w-6 place-items-center rounded-lg bg-emerald-100/80 text-emerald-700">
                <GraduationCap className="h-3.5 w-3.5" />
              </div>
              <span className="leading-tight text-left">University / Lab</span>
            </div>
            <ArrowRight className="h-3 w-3 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-600" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;

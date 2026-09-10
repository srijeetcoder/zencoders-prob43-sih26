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
} from "lucide-react";
import { useAuth, type UserRole } from "../../context/AuthContext";

function LoginForm() {
  const { login } = useAuth();
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
  const [formData, setFormData] = useState({
    email: initialRole === "CITIZEN" ? "" : "gov.officer@jharkhand.gov.in",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (roleParam === "citizen") {
      setSelectedRole("CITIZEN");
      setFormData({ email: "", password: "" });
    } else if (roleParam === "university" || roleParam === "institution") {
      setSelectedRole("INSTITUTION");
      setFormData({ email: "rnd.director@bitmesra.ac.in", password: "" });
    } else if (roleParam === "gov" || roleParam === "government") {
      setSelectedRole("GOVERNMENT");
      setFormData({ email: "gov.officer@jharkhand.gov.in", password: "" });
    }
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
    if (role === "GOVERNMENT") {
      setFormData({ email: "gov.officer@jharkhand.gov.in", password: "" });
    } else if (role === "INSTITUTION") {
      setFormData({ email: "rnd.director@bitmesra.ac.in", password: "" });
    } else if (role === "CITIZEN") {
      setFormData({ email: "", password: "" });
    } else {
      setFormData({ email: "admin@jansahyog.gov.in", password: "" });
    }
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
      });

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
    } catch (err: any) {
      setError(err?.message || "Unable to sign in. Please verify your credentials.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-xl p-5 sm:p-7 shadow-[0_25px_60px_rgba(15,23,42,0.12)]">
      {/* Background Official Emblem Watermark */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none z-0"
        aria-hidden="true"
      >
        <img
          src="/emblem.png"
          alt="Official Emblem Watermark"
          className="h-[75%] w-[75%] object-contain opacity-[0.045] filter grayscale"
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

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700">
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Authentication successful! Redirecting...</span>
            </div>
          )}

          {/* Email / ID Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Official Email / User ID
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
                placeholder="name@gov.in, .ac.in or phone"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Security Password / OTP
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
                placeholder="Enter password"
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
            disabled={isSubmitting || success}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#047d48] py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#03663a] active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-3 sm:my-4 text-center">
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

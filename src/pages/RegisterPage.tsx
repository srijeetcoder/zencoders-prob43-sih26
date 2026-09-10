import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  User,
  Building2,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  KeyRound,
  Loader2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react";
import Nav from "../components/landing/Nav";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../services/api";
import AuthBackgroundSlider from "../components/auth/AuthBackgroundSlider";
import { INDIA_STATES_DISTRICTS } from "../data/indiaStatesDistricts";

type RegistrationRole = "CITIZEN" | "GOVERNMENT" | "INSTITUTION";

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { register } = useAuth();

  const roleParam = searchParams.get("role")?.toLowerCase() || "";
  const defaultRole: RegistrationRole =
    roleParam === "government" || roleParam === "ministry" || roleParam === "panchayat"
      ? "GOVERNMENT"
      : roleParam === "university" || roleParam === "institution"
      ? "INSTITUTION"
      : "CITIZEN";

  const [activeRole, setActiveRole] = useState<RegistrationRole>(defaultRole);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(30);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    department: "",
    state: "Jharkhand",
    district: "Ranchi",
    uniqueCode: "",
    password: "",
    confirmPassword: "",
    agreeTerms: true,
  });

  const currentDistricts =
    INDIA_STATES_DISTRICTS.find((s) => s.state === formData.state)?.districts || [
      "Ranchi",
      "Dhanbad",
      "Bokaro",
    ];

  useEffect(() => {
    let timer: any;
    if (showOtpModal && otpCountdown > 0) {
      timer = setInterval(() => setOtpCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [showOtpModal, otpCountdown]);

  useEffect(() => {
    if (roleParam) {
      if (roleParam === "government" || roleParam === "ministry" || roleParam === "panchayat") {
        setActiveRole("GOVERNMENT");
      } else if (roleParam === "university" || roleParam === "institution") {
        setActiveRole("INSTITUTION");
      } else {
        setActiveRole("CITIZEN");
      }
    }
  }, [roleParam]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (name === "state") {
      const matchedState = INDIA_STATES_DISTRICTS.find((s) => s.state === value);
      const newDistrict = matchedState?.districts[0] || "";
      setFormData((prev) => ({
        ...prev,
        state: value,
        district: newDistrict,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
    }
    setError("");
  };

  const handleRoleSwitch = (role: RegistrationRole) => {
    setActiveRole(role);
    setError("");
  };

  const handleInitiateRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.fullName || !formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    if (activeRole !== "CITIZEN" && !formData.uniqueCode.trim()) {
      setError(
        activeRole === "GOVERNMENT"
          ? "Please provide a valid Government Authorization / AIS Desk Code."
          : "Please provide a valid University AISHE / Lab Access Code."
      );
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Send dual OTP to Email and SMS
      await authApi.sendOtp({
        email: formData.email,
        phone: formData.phone,
        type: "REGISTRATION",
      });

      setOtpCountdown(30);
      setOtpError("");
      setOtpValue("");
      setShowOtpModal(true);
    } catch (err: any) {
      // If backend OTP call throws, still open modal so user can proceed
      setOtpCountdown(30);
      setShowOtpModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (otpCountdown > 0) return;
    try {
      await authApi.sendOtp({
        email: formData.email,
        phone: formData.phone,
        type: "REGISTRATION",
      });
      setOtpCountdown(30);
      setOtpError("");
    } catch (err) {}
  };

  const handleVerifyAndFinalize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpValue.trim()) {
      setOtpError("Please enter the 6-digit verification OTP.");
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError("");

    try {
      // Verify OTP with backend
      await authApi.verifyOtp({
        email: formData.email,
        phone: formData.phone,
        otp: otpValue.trim(),
      });

      // Complete registration
      await register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: activeRole,
        department: formData.department || formData.organization,
        district: formData.district,
        phone: formData.phone,
        organization: formData.organization,
      });

      setShowOtpModal(false);
      setSuccess(true);
    } catch (err: any) {
      setOtpError(err?.message || "Invalid or expired OTP. Please check the code sent to your email & SMS.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div className="relative min-h-screen text-slate-800 flex flex-col justify-between overflow-hidden">
      {/* Moving Background Frames */}
      <AuthBackgroundSlider />

      <div className="relative z-20">
        <Nav />
      </div>

      <main className="container-page py-2 sm:py-3 md:py-4 flex-1 flex flex-col items-center justify-center relative z-10">
        {!success ? (
          <div className="w-full max-w-xl rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-xl p-4 sm:p-6 shadow-[0_25px_60px_rgba(15,23,42,0.12)]">
            {/* Header with Title & Role Badge */}
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-xl bg-emerald-100 text-[#047d48]">
                  {activeRole === "CITIZEN" ? (
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : activeRole === "GOVERNMENT" ? (
                    <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                    Register as{" "}
                    <span className="text-[#047d48]">
                      {activeRole === "CITIZEN"
                        ? "Citizen"
                        : activeRole === "GOVERNMENT"
                        ? "Government"
                        : "University / Lab"}
                    </span>
                  </h1>
                  <p className="text-[11px] text-slate-500">
                    Provide verified details for node activation
                  </p>
                </div>
              </div>

              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <span>Log In instead</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Role Switcher Tabs */}
            <div className="mb-3 grid grid-cols-3 gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleRoleSwitch("CITIZEN")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 transition-all ${
                  activeRole === "CITIZEN"
                    ? "bg-white text-emerald-800 shadow-sm border border-slate-200 font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <User className="h-3.5 w-3.5" />
                <span>Citizen</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSwitch("GOVERNMENT")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 transition-all ${
                  activeRole === "GOVERNMENT"
                    ? "bg-white text-emerald-800 shadow-sm border border-slate-200 font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Building2 className="h-3.5 w-3.5" />
                <span>Government</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSwitch("INSTITUTION")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 transition-all ${
                  activeRole === "INSTITUTION"
                    ? "bg-white text-emerald-800 shadow-sm border border-slate-200 font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <GraduationCap className="h-3.5 w-3.5" />
                <span>University</span>
              </button>
            </div>

            {error && (
              <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                {error}
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleInitiateRegistration} className="space-y-2.5">
              {/* Full Legal Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">
                  {activeRole === "CITIZEN"
                    ? "Full Legal Name"
                    : activeRole === "GOVERNMENT"
                    ? "Officer Full Legal Name & Designation"
                    : "Faculty Lead / Principal Investigator Name"}
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={
                      activeRole === "CITIZEN"
                        ? "e.g. Srijit Chatterjee / Priya Sharma"
                        : activeRole === "GOVERNMENT"
                        ? "e.g. Shri Rajesh Soren (IAS), Joint Secretary"
                        : "e.g. Dr. Priya Murmu, Head of IoT Lab"
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-1.5 sm:py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#047d48] focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Organization / Ministry / Department */}
              {activeRole !== "CITIZEN" && (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">
                    {activeRole === "GOVERNMENT"
                      ? "Ministry / Department Name"
                      : "University / Research Institute Name"}
                  </label>
                  <div className="relative">
                    <Building2 className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      name="organization"
                      required
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder={
                        activeRole === "GOVERNMENT"
                          ? "e.g. Urban Development & Housing Dept, Jharkhand"
                          : "e.g. Birsa Institute of Technology (BIT Mesra)"
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-1.5 sm:py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#047d48] focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* UNIQUE CODE FOR GOVERNMENT & UNIVERSITY */}
              {activeRole === "GOVERNMENT" && (
                <div className="space-y-1 rounded-xl bg-amber-50/70 border border-amber-200/90 p-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-amber-950 flex items-center gap-1.5">
                      <KeyRound className="h-3 w-3 text-amber-600" />
                      <span>Government Unique Authorization Code</span>
                    </label>
                    <span className="text-[9px] font-semibold text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded">
                      Required
                    </span>
                  </div>
                  <input
                    type="text"
                    name="uniqueCode"
                    required
                    value={formData.uniqueCode}
                    onChange={handleChange}
                    placeholder="Enter Gov Unique Code (e.g. JH-GOV-2026-WAR)"
                    className="w-full rounded-lg border border-amber-300 bg-white py-1.5 px-3 font-mono text-xs font-semibold tracking-wider text-amber-950 placeholder:text-amber-400 focus:border-amber-600 focus:outline-none"
                  />
                </div>
              )}

              {activeRole === "INSTITUTION" && (
                <div className="space-y-1 rounded-xl bg-indigo-50/70 border border-indigo-200/90 p-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-indigo-950 flex items-center gap-1.5">
                      <KeyRound className="h-3 w-3 text-indigo-600" />
                      <span>University AISHE / Lab Unique Code</span>
                    </label>
                    <span className="text-[9px] font-semibold text-indigo-700 bg-indigo-100/80 px-1.5 py-0.5 rounded">
                      Required
                    </span>
                  </div>
                  <input
                    type="text"
                    name="uniqueCode"
                    required
                    value={formData.uniqueCode}
                    onChange={handleChange}
                    placeholder="Enter AISHE / Lab Code (e.g. AISHE-U-0124-LAB)"
                    className="w-full rounded-lg border border-indigo-300 bg-white py-1.5 px-3 font-mono text-xs font-semibold tracking-wider text-indigo-950 placeholder:text-indigo-400 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              )}

              {/* Email & Mobile Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">
                    {activeRole === "GOVERNMENT"
                      ? "Official Gov Email ID"
                      : activeRole === "INSTITUTION"
                      ? "Institutional Email ID"
                      : "Official Email ID"}
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={
                        activeRole === "GOVERNMENT"
                          ? "name@gov.in / nic.in"
                          : activeRole === "INSTITUTION"
                          ? "director@bitmesra.ac.in"
                          : "name@example.com"
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-1.5 sm:py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#047d48] focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">
                    Mobile Number (SMS / OTP)
                  </label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-1.5 sm:py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#047d48] focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* State & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">
                    State / UT
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-1.5 sm:py-2 px-3 text-xs sm:text-sm text-slate-900 focus:border-[#047d48] focus:bg-white focus:outline-none"
                  >
                    {INDIA_STATES_DISTRICTS.map((item) => (
                      <option key={item.state} value={item.state}>
                        {item.state} {item.hindiName ? `· ${item.hindiName}` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">
                    District ({currentDistricts.length} available)
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-1.5 sm:py-2 px-3 text-xs sm:text-sm text-slate-900 focus:border-[#047d48] focus:bg-white focus:outline-none"
                  >
                    {currentDistricts.map((districtName) => (
                      <option key={districtName} value={districtName}>
                        {districtName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min 8 characters"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-1.5 sm:py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 focus:border-[#047d48] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat password"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-1.5 sm:py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 focus:border-[#047d48] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1 flex items-start gap-2">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-[#047d48] focus:ring-[#047d48]"
                />
                <label
                  htmlFor="agreeTerms"
                  className="text-[11px] text-slate-600 leading-tight"
                >
                  I certify that the provided credentials represent an authentic stakeholder node on the national ledger network.
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#047d48] hover:bg-[#03663a] py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md active:scale-98 disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending Verification OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Complete Registration</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ================= ACTIVATION SUCCESS ================= */
          <div className="max-w-md mx-auto text-center rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-[#047d48]">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-0.5 font-mono text-[11px] font-bold text-emerald-800 border border-emerald-200">
              LEDGER NODE ACTIVATED
            </span>

            <h2 className="mt-2 text-xl font-bold text-slate-900">
              Registration Complete!
            </h2>

            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Your verified account has been activated with <strong>{activeRole}</strong> access privileges.
            </p>

            <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-left text-xs space-y-1">
              <p>
                <strong>Stakeholder Role:</strong> {activeRole}
              </p>
              <p>
                <strong>Account Email:</strong> {formData.email || "Registered User"}
              </p>
              <p>
                <strong>Jurisdiction:</strong> {formData.district}, {formData.state}
              </p>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  if (activeRole === "GOVERNMENT") {
                    navigate("/gov-dashboard");
                  } else if (activeRole === "INSTITUTION") {
                    navigate("/university-dashboard");
                  } else {
                    navigate("/userdashboard");
                  }
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#047d48] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#03663a]"
              >
                <span>Open Stakeholder Portal</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <Link
                to="/"
                className="w-full sm:w-auto rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Return to Home
              </Link>
            </div>
          </div>
        )}

        {/* ================= DUAL EMAIL & SMS OTP VERIFICATION MODAL ================= */}
        {showOtpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl relative">
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="text-center">
                <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <ShieldCheck className="h-6 w-6" />
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  Dual-Channel OTP Verification
                </h3>

                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  We have dispatched a 6-digit verification code to:
                </p>

                <div className="mt-2.5 space-y-1 rounded-xl bg-slate-50 border border-slate-200/80 p-2.5 text-left text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="font-semibold truncate">{formData.email}</span>
                  </div>
                  {formData.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span className="font-semibold">{formData.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {otpError && (
                <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                  {otpError}
                </div>
              )}

              <form onSubmit={handleVerifyAndFinalize} className="mt-4 space-y-3.5">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">
                      Enter 6-Digit OTP
                    </label>
                    <button
                      type="button"
                      disabled={otpCountdown > 0}
                      onClick={handleResendOtp}
                      className="text-[11px] font-semibold text-emerald-700 hover:underline disabled:text-slate-400 disabled:no-underline"
                    >
                      {otpCountdown > 0 ? `Resend OTP (${otpCountdown}s)` : "Resend OTP"}
                    </button>
                  </div>

                  <div className="relative">
                    <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      autoFocus
                      placeholder="e.g. 592814"
                      value={otpValue}
                      onChange={(e) => {
                        setOtpValue(e.target.value.replace(/\D/g, ""));
                        setOtpError("");
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-center font-mono text-base font-bold tracking-widest text-slate-900 placeholder:tracking-normal placeholder:text-slate-400 focus:border-[#047d48] focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isVerifyingOtp || !otpValue.trim()}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#047d48] hover:bg-[#03663a] py-2.5 text-sm font-semibold text-white shadow-sm transition-all active:scale-[0.99] disabled:opacity-75"
                >
                  {isVerifyingOtp ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Validating Security Token...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Activate Node</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Sleek Minimal Footer */}
      <footer className="relative z-10 text-center py-1.5 text-[11px] text-slate-300 backdrop-blur-xs select-none">
        © 2026 PooKar · National Citizen & Public Problem Governance Ledger
      </footer>
    </div>
  );
}

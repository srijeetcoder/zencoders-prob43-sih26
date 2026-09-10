import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  User,
  Building2,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Mail,
  Phone,
  KeyRound,
  Loader2,
  Check,
} from "lucide-react";
import Nav from "../components/landing/Nav";
import Footer from "../components/landing/Footer";
import { useAuth, type UserRole } from "../context/AuthContext";

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
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    setError("");
  };

  const handleRoleSwitch = (role: RegistrationRole) => {
    setActiveRole(role);
    setError("");
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
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
      await register({
        name: formData.fullName,
        email: formData.email,
        role: activeRole,
        department: formData.department || formData.organization,
        district: formData.district,
        phone: formData.phone,
        organization: formData.organization,
      });

      setSuccess(true);
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-between">
      <Nav />

      <main className="container-page py-10 md:py-14 flex-1 flex flex-col items-center justify-center">
        {!success ? (
          <div className="w-full max-w-xl rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-9 shadow-[0_15px_45px_rgba(15,23,42,0.06)]">
            {/* Header with Title & Role Badge */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-100 text-[#047d48]">
                  {activeRole === "CITIZEN" ? (
                    <User className="h-5 w-5" />
                  ) : activeRole === "GOVERNMENT" ? (
                    <Building2 className="h-5 w-5" />
                  ) : (
                    <GraduationCap className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                    Register as{" "}
                    <span className="text-[#047d48]">
                      {activeRole === "CITIZEN"
                        ? "Citizen"
                        : activeRole === "GOVERNMENT"
                        ? "Government"
                        : "University / Lab"}
                    </span>
                  </h1>
                  <p className="text-xs text-slate-500">
                    Provide verified details for node activation
                  </p>
                </div>
              </div>

              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-700"
              >
                <span>Log In instead</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Role Switcher Tabs */}
            <div className="mb-6 grid grid-cols-3 gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleRoleSwitch("CITIZEN")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 transition-all ${
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
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 transition-all ${
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
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 transition-all ${
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
              <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-medium text-rose-700">
                {error}
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmitRegistration} className="space-y-4">
              {/* Full Legal Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  {activeRole === "CITIZEN"
                    ? "Full Legal Name"
                    : activeRole === "GOVERNMENT"
                    ? "Officer Full Legal Name & Designation"
                    : "Faculty Lead / Principal Investigator Name"}
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
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
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#047d48] focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Organization / Ministry / Department */}
              {activeRole !== "CITIZEN" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    {activeRole === "GOVERNMENT"
                      ? "Ministry / Department Name"
                      : "University / Research Institute Name"}
                  </label>
                  <div className="relative">
                    <Building2 className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
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
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#047d48] focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* UNIQUE CODE FOR GOVERNMENT & UNIVERSITY */}
              {activeRole === "GOVERNMENT" && (
                <div className="space-y-1.5 rounded-2xl bg-amber-50/70 border border-amber-200/90 p-3.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <KeyRound className="h-3.5 w-3.5 text-amber-600" />
                      <span>Government Unique Authorization Code</span>
                    </label>
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md">
                      Required for Gov Nodes
                    </span>
                  </div>
                  <input
                    type="text"
                    name="uniqueCode"
                    required
                    value={formData.uniqueCode}
                    onChange={handleChange}
                    placeholder="Enter official Gov Unique Code (e.g. JH-GOV-2026-WAR)"
                    className="w-full rounded-xl border border-amber-300 bg-white py-2.5 px-3.5 font-mono text-sm font-semibold tracking-wider text-amber-950 placeholder:text-amber-400 focus:border-amber-600 focus:outline-none"
                  />
                  <p className="text-[11px] text-amber-700">
                    Enter the AIS / Ministry verification token dispatched by the State War Room nodal desk.
                  </p>
                </div>
              )}

              {activeRole === "INSTITUTION" && (
                <div className="space-y-1.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/90 p-3.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                      <KeyRound className="h-3.5 w-3.5 text-indigo-600" />
                      <span>University Unique Institute / AISHE Code</span>
                    </label>
                    <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-md">
                      Required for Lab Nodes
                    </span>
                  </div>
                  <input
                    type="text"
                    name="uniqueCode"
                    required
                    value={formData.uniqueCode}
                    onChange={handleChange}
                    placeholder="Enter AISHE / Lab Unique Code (e.g. AISHE-U-0124-LAB)"
                    className="w-full rounded-xl border border-indigo-300 bg-white py-2.5 px-3.5 font-mono text-sm font-semibold tracking-wider text-indigo-950 placeholder:text-indigo-400 focus:border-indigo-600 focus:outline-none"
                  />
                  <p className="text-[11px] text-indigo-700">
                    Enter your All India Survey on Higher Education (AISHE) accreditation code or MoE / DST R&D grant token.
                  </p>
                </div>
              )}

              {/* Email & Mobile Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    {activeRole === "GOVERNMENT"
                      ? "Official Gov Email ID"
                      : activeRole === "INSTITUTION"
                      ? "Institutional Email ID"
                      : "Official Email ID"}
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
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
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#047d48] focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Mobile Number (for SMS & OTP)
                  </label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#047d48] focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* State & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    State / UT
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3 text-sm text-slate-900 focus:border-[#047d48] focus:bg-white focus:outline-none"
                  >
                    <option value="Jharkhand">Jharkhand · झारखण्ड</option>
                    <option value="West Bengal">West Bengal · पश्चिम बंगाल</option>
                    <option value="Bihar">Bihar · बिहार</option>
                    <option value="Uttar Pradesh">Uttar Pradesh · उत्तर प्रदेश</option>
                    <option value="Odisha">Odisha · ओडिशा</option>
                    <option value="Madhya Pradesh">Madhya Pradesh · मध्य प्रदेश</option>
                    <option value="Maharashtra">Maharashtra · महाराष्ट्र</option>
                    <option value="Delhi">Delhi · दिल्ली</option>
                    <option value="Karnataka">Karnataka · कर्नाटक</option>
                    <option value="Tamil Nadu">Tamil Nadu · तमिलनाडु</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    District
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="e.g. Ranchi, Dhanbad, Kolkata"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3 text-sm text-slate-900 focus:border-[#047d48] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimum 8 characters"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 focus:border-[#047d48] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat password"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 focus:border-[#047d48] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-[#047d48] focus:ring-[#047d48]"
                />
                <label
                  htmlFor="agreeTerms"
                  className="text-xs text-slate-600 leading-normal"
                >
                  I certify that the provided credentials represent an authentic stakeholder node on the national ledger network.
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <Link
                  to="/"
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  ← Back to Home
                </Link>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-[#047d48] hover:bg-[#03663a] px-7 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md active:scale-98 disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Activating Verified Node...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ================= ACTIVATION SUCCESS ================= */
          <div className="max-w-md mx-auto text-center rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-emerald-100 text-[#047d48]">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1 font-mono text-xs font-bold text-emerald-800 border border-emerald-200">
              LEDGER NODE ACTIVATED
            </span>

            <h2 className="mt-3 text-2xl font-bold text-slate-900">
              Registration Complete!
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Your verified account has been activated with <strong>{activeRole}</strong> access privileges.
            </p>

            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100 text-left text-xs space-y-1.5">
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

            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (activeRole === "GOVERNMENT") {
                    navigate("/gov-dashboard");
                  } else if (activeRole === "INSTITUTION") {
                    navigate("/solution-matching");
                  } else {
                    navigate("/main");
                  }
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#047d48] px-6 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#03663a]"
              >
                <span>Open Stakeholder Portal</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <Link
                to="/"
                className="w-full sm:w-auto rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Return to Home
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

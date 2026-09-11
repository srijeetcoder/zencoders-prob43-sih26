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
  AlertCircle,
  X,
  Microscope,
  BookOpen,
} from "lucide-react";
import Nav from "../components/landing/Nav";
import { useAuth, type AcademicRole } from "../context/AuthContext";
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
      : roleParam === "university" || roleParam === "institution" || roleParam === "student" || roleParam === "faculty" || roleParam === "admin"
      ? "INSTITUTION"
      : "CITIZEN";

  const defaultAcademicBranch: AcademicRole =
    roleParam === "faculty"
      ? "FACULTY"
      : roleParam === "admin"
      ? "ADMIN"
      : "STUDENT";

  const [activeRole, setActiveRole] = useState<RegistrationRole>(defaultRole);
  const [academicBranch, setAcademicBranch] = useState<AcademicRole>(defaultAcademicBranch);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    department: "",
    state: "Jharkhand",
    district: "Ranchi",
    governmentId: "",
    uniqueCode: "",
    facultyId: "",
    password: "",
    confirmPassword: "",
    agreeTerms: true,
  });

  const currentDistricts =
    INDIA_STATES_DISTRICTS.find((s) => s.state === formData.state)?.districts || [
      "Ranchi",
      "Dhanbad",
      "Bokaro",
      "East Singhbhum",
      "Palamu",
      "Hazaribagh",
      "Deoghar",
      "Dumka",
    ];

  useEffect(() => {
    if (roleParam) {
      if (roleParam === "government" || roleParam === "ministry" || roleParam === "panchayat") {
        setActiveRole("GOVERNMENT");
      } else if (roleParam === "student") {
        setActiveRole("INSTITUTION");
        setAcademicBranch("STUDENT");
      } else if (roleParam === "faculty") {
        setActiveRole("INSTITUTION");
        setAcademicBranch("FACULTY");
      } else if (roleParam === "admin") {
        setActiveRole("INSTITUTION");
        setAcademicBranch("ADMIN");
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

  const handleAcademicBranchSelect = (branch: AcademicRole) => {
    setAcademicBranch(branch);
    setError("");
  };

  const handleInitiateRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (activeRole === "GOVERNMENT") {
      if (!formData.governmentId.trim()) {
        setError("Official Government / Employee ID or 7-character Invite Code is required.");
        return;
      }
    }

    if (activeRole === "INSTITUTION") {
      if (!formData.organization.trim()) {
        setError("Please specify your University or Institute name.");
        return;
      }
      if (academicBranch === "STUDENT" && !formData.uniqueCode.trim()) {
        setError("Please enter your Student Roll / Registration Number.");
        return;
      }
      if (academicBranch === "FACULTY" && (!formData.facultyId.trim() || !formData.uniqueCode.trim())) {
        setError("Please provide both Faculty Employee ID and University AISHE code.");
        return;
      }
      if (academicBranch === "ADMIN" && !formData.uniqueCode.trim()) {
        setError("Please enter the official University AISHE Code.");
        return;
      }
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await register({
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: activeRole,
        academicRole: activeRole === "INSTITUTION" ? academicBranch : undefined,
        department: formData.department || formData.organization,
        district: formData.district,
        phone: formData.phone.trim() || undefined,
        organization: formData.organization,
        government_id: activeRole === "GOVERNMENT" ? formData.governmentId.trim().toUpperCase() : undefined,
        institution_id: activeRole === "INSTITUTION" ? formData.uniqueCode.trim().toUpperCase() : undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        if (activeRole === "GOVERNMENT") {
          navigate("/gov-dashboard");
        } else if (activeRole === "INSTITUTION") {
          navigate("/university-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      }, 1200);
    } catch (err: any) {
      setError(err?.message || "Registration failed. Please verify your unique code and credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get active role display title
  const getRoleHeader = () => {
    if (activeRole === "CITIZEN") return "Citizen";
    if (activeRole === "GOVERNMENT") return "Government Officer";
    if (academicBranch === "STUDENT") return "Student Innovator";
    if (academicBranch === "FACULTY") return "Faculty Guide / Evaluator";
    return "Institution Admin / Lab Director";
  };

  const getRoleSubtitle = () => {
    if (activeRole === "CITIZEN") return "Two-factor verified citizen node activation on PooKar ledger";
    if (activeRole === "GOVERNMENT") return "Verified district / state administrative nodal activation";
    if (academicBranch === "STUDENT") return "Campus student innovator node for civic problem-solving & prototypes";
    if (academicBranch === "FACULTY") return "Academic mentor node for project validation, DPR endorsement & grants";
    return "Institutional administrative node for R&D governance & state liaison";
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
                  ) : academicBranch === "STUDENT" ? (
                    <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : academicBranch === "FACULTY" ? (
                    <Microscope className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                    Register as{" "}
                    <span className="text-[#047d48]">{getRoleHeader()}</span>
                  </h1>
                  <p className="text-[11px] text-slate-500">
                    {getRoleSubtitle()}
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

            {/* Main Role Switcher Tabs */}
            <div className="mb-3 grid grid-cols-3 gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleRoleSwitch("CITIZEN")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 transition-all ${
                  activeRole === "CITIZEN"
                    ? "bg-white text-emerald-800 shadow-xs border border-slate-200 font-bold"
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
                    ? "bg-white text-emerald-800 shadow-xs border border-slate-200 font-bold"
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
                    ? "bg-white text-emerald-800 shadow-xs border border-slate-200 font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <GraduationCap className="h-3.5 w-3.5" />
                <span>University</span>
              </button>
            </div>

            {/* Branched Academic Role Selector (When University is active) */}
            {activeRole === "INSTITUTION" && (
              <div className="mb-3.5 p-2 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                <div className="mb-1.5 flex items-center justify-between px-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900">
                    Academic Role Branch
                  </span>
                  <span className="text-[10px] text-indigo-600 font-medium">
                    Select your campus stakeholder role
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => handleAcademicBranchSelect("STUDENT")}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl transition-all ${
                      academicBranch === "STUDENT"
                        ? "bg-white text-indigo-950 font-bold shadow-xs border border-indigo-200"
                        : "text-indigo-700/80 hover:bg-white/60"
                    }`}
                  >
                    <span>🎓</span>
                    <span>Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAcademicBranchSelect("FACULTY")}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl transition-all ${
                      academicBranch === "FACULTY"
                        ? "bg-white text-indigo-950 font-bold shadow-xs border border-indigo-200"
                        : "text-indigo-700/80 hover:bg-white/60"
                    }`}
                  >
                    <span>🔬</span>
                    <span>Faculty</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAcademicBranchSelect("ADMIN")}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl transition-all ${
                      academicBranch === "ADMIN"
                        ? "bg-white text-indigo-950 font-bold shadow-xs border border-indigo-200"
                        : "text-indigo-700/80 hover:bg-white/60"
                    }`}
                  >
                    <span>🏛️</span>
                    <span>Admin</span>
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-3 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                <span>{error}</span>
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
                    ? "Officer Full Legal Name & Rank"
                    : academicBranch === "STUDENT"
                    ? "Student Full Legal Name"
                    : academicBranch === "FACULTY"
                    ? "Faculty Full Legal Name & Designation"
                    : "Dean / Director / Nodal Officer Name"}
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
                        ? "e.g. Srijit Chatterjee"
                        : activeRole === "GOVERNMENT"
                        ? "e.g. Shri Rajesh Soren (IAS), Nodal Officer"
                        : academicBranch === "STUDENT"
                        ? "e.g. Aakash Verma"
                        : academicBranch === "FACULTY"
                        ? "e.g. Dr. Anirban Mukherjee, Associate Professor"
                        : "e.g. Dr. Priya Murmu, Dean R&D"
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-1.5 sm:py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#047d48] focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Organization / Ministry / University */}
              {activeRole !== "CITIZEN" && (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">
                    {activeRole === "GOVERNMENT"
                      ? "Department / Ministry / Agency"
                      : academicBranch === "STUDENT"
                      ? "University / Engineering College / Institute"
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

              {/* Department / Branch (For University Stakeholders) */}
              {activeRole === "INSTITUTION" && (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">
                    {academicBranch === "STUDENT"
                      ? "Academic Department & Branch / Major"
                      : academicBranch === "FACULTY"
                      ? "Department & Research Division"
                      : "Administrative Office / Directorate"}
                  </label>
                  <div className="relative">
                    <BookOpen className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder={
                        academicBranch === "STUDENT"
                          ? "e.g. Electronics & Communication Engineering"
                          : academicBranch === "FACULTY"
                          ? "e.g. Civil & Environmental Engineering"
                          : "e.g. Office of Dean (R&D) / Innovation Cell"
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-1.5 sm:py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#047d48] focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* OFFICIAL GOVERNMENT / EMPLOYEE ID (IF PROVIDED) */}
              {activeRole === "GOVERNMENT" && (
                <div className="space-y-1 rounded-xl bg-slate-50/80 border border-slate-200/90 p-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                      <KeyRound className="h-3 w-3 text-emerald-600" />
                      <span>Official Government / Employee ID (Optional)</span>
                    </label>
                    <span className="text-[9px] font-semibold text-slate-500 bg-slate-200/70 px-1.5 py-0.5 rounded">
                      If Provided
                    </span>
                  </div>
                  <input
                    type="text"
                    name="governmentId"
                    value={formData.governmentId}
                    onChange={handleChange}
                    placeholder="Enter official designation / employee code (if provided)"
                    className="w-full rounded-lg border border-slate-200 bg-white py-1.5 px-3 font-mono text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#047d48] focus:outline-none uppercase"
                  />
                  <p className="text-[10px] text-slate-500">
                    Official state / district government code if assigned by your department.
                  </p>
                </div>
              )}

              {/* ROLE-SPECIFIC CODE: STUDENT ROLL NUMBER */}
              {activeRole === "INSTITUTION" && academicBranch === "STUDENT" && (
                <div className="space-y-1 rounded-xl bg-indigo-50/70 border border-indigo-200/90 p-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-indigo-950 flex items-center gap-1.5">
                      <KeyRound className="h-3 w-3 text-indigo-600" />
                      <span>Student Roll / Registration Number</span>
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
                    placeholder="e.g. 2022-EC-042 or 2201389"
                    className="w-full rounded-lg border border-indigo-300 bg-white py-1.5 px-3 font-mono text-xs font-semibold tracking-wider text-indigo-950 placeholder:text-indigo-400 focus:border-indigo-600 focus:outline-none uppercase"
                  />
                  <p className="text-[10px] text-indigo-600/90">
                    Allocated student exam/enrolment roll number for institutional innovation clearance.
                  </p>
                </div>
              )}

              {/* ROLE-SPECIFIC CODE: FACULTY EMPLOYEE CODE & AISHE */}
              {activeRole === "INSTITUTION" && academicBranch === "FACULTY" && (
                <div className="space-y-2 rounded-xl bg-indigo-50/70 border border-indigo-200/90 p-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-indigo-950 flex items-center gap-1.5">
                        <KeyRound className="h-3 w-3 text-indigo-600" />
                        <span>Faculty Employee ID</span>
                      </label>
                      <input
                        type="text"
                        name="facultyId"
                        required
                        value={formData.facultyId}
                        onChange={handleChange}
                        placeholder="e.g. FAC-BIT-2041"
                        className="w-full rounded-lg border border-indigo-300 bg-white py-1.5 px-3 font-mono text-xs font-semibold tracking-wider text-indigo-950 placeholder:text-indigo-400 focus:border-indigo-600 focus:outline-none uppercase"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-indigo-950 flex items-center gap-1.5">
                        <KeyRound className="h-3 w-3 text-indigo-600" />
                        <span>University AISHE Code</span>
                      </label>
                      <input
                        type="text"
                        name="uniqueCode"
                        required
                        value={formData.uniqueCode}
                        onChange={handleChange}
                        placeholder="e.g. AISHE-U-0268"
                        className="w-full rounded-lg border border-indigo-300 bg-white py-1.5 px-3 font-mono text-xs font-semibold tracking-wider text-indigo-950 placeholder:text-indigo-400 focus:border-indigo-600 focus:outline-none uppercase"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-indigo-600/90">
                    Required for official mentor endorsement of student DPR solution plans and prototypes.
                  </p>
                </div>
              )}

              {/* ROLE-SPECIFIC CODE: UNIVERSITY ADMIN AISHE CODE */}
              {activeRole === "INSTITUTION" && academicBranch === "ADMIN" && (
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
                    placeholder="Enter AISHE / Lab Code (e.g. AISHE-U-0268-LAB)"
                    className="w-full rounded-lg border border-indigo-300 bg-white py-1.5 px-3 font-mono text-xs font-semibold tracking-wider text-indigo-950 placeholder:text-indigo-400 focus:border-indigo-600 focus:outline-none uppercase"
                  />
                  <p className="text-[10px] text-indigo-600/90">
                    Ministry of Education AISHE institutional accreditation key for research grant sanctions.
                  </p>
                </div>
              )}

              {/* Email & Mobile Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">
                    {activeRole === "GOVERNMENT"
                      ? "Official Gov Email ID"
                      : activeRole === "INSTITUTION" && academicBranch === "STUDENT"
                      ? "Student Institutional Email (.ac.in)"
                      : activeRole === "INSTITUTION" && academicBranch === "FACULTY"
                      ? "Faculty Institutional Email ID"
                      : activeRole === "INSTITUTION" && academicBranch === "ADMIN"
                      ? "Admin Official Email ID"
                      : "Email Address"}
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
                          ? "officer@jharkhand.gov.in"
                          : activeRole === "INSTITUTION" && academicBranch === "STUDENT"
                          ? "student.innovator@bitmesra.ac.in"
                          : activeRole === "INSTITUTION" && academicBranch === "FACULTY"
                          ? "faculty.guide@bitmesra.ac.in"
                          : activeRole === "INSTITUTION" && academicBranch === "ADMIN"
                          ? "admin.institution@bitmesra.ac.in"
                          : "citizen@example.com"
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-1.5 sm:py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#047d48] focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">
                    Mobile Number (SMS Verification)
                  </label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
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
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#047d48] hover:bg-[#03663a] py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:shadow-md active:scale-98 disabled:opacity-75 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Verifying Credentials & Activating Node...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {activeRole === "GOVERNMENT"
                          ? "Verify Code & Activate Gov Node"
                          : activeRole === "INSTITUTION"
                          ? "Verify Academic ID & Create Account"
                          : "Create Citizen Account"}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ================= ACTIVATION SUCCESS ================= */
          <div className="max-w-md mx-auto text-center rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
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
              Your verified account has been activated with{" "}
              <strong>
                {activeRole === "INSTITUTION"
                  ? `${academicBranch} (University Innovation Portal)`
                  : activeRole}
              </strong>{" "}
              access privileges.
            </p>

            <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-left text-xs space-y-1">
              <p>
                <strong>Stakeholder Role:</strong> {activeRole}
                {activeRole === "INSTITUTION" && (
                  <span className="ml-1.5 font-semibold text-indigo-700">
                    ({academicBranch === "STUDENT" ? "Student Innovator" : academicBranch === "FACULTY" ? "Faculty Guide" : "Institution Admin"})
                  </span>
                )}
              </p>
              {activeRole === "GOVERNMENT" && formData.governmentId && (
                <p className="font-mono text-emerald-800 font-bold">
                  <strong>Government ID:</strong> {formData.governmentId}
                </p>
              )}
              {activeRole === "INSTITUTION" && formData.uniqueCode && (
                <p className="font-mono text-indigo-800 font-bold">
                  <strong>{academicBranch === "STUDENT" ? "Roll No:" : "AISHE / Lab Code:"}</strong> {formData.uniqueCode}
                </p>
              )}
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
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#047d48] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#03663a] cursor-pointer"
              >
                <span>Open Stakeholder Portal</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <Link
                to="/"
                className="w-full sm:w-auto rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 text-center"
              >
                Return to Home
              </Link>
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

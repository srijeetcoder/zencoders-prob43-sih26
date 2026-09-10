import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, KeyRound, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";

function ForgetPassword() {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.email) return;
    setStep(2);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
    }, 800);
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(15,23,42,0.12)]">
      <div className="mb-4 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Account Security Recovery</span>
        </div>
        <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
          Reset Password
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          {step === 1
            ? "Enter your registered email address to receive an OTP."
            : "Enter the OTP sent to your email to verify and reset."}
        </p>
      </div>

      {!success ? (
        <form onSubmit={step === 1 ? handleNext : handleSubmit} className="space-y-3.5">
          {step === 1 && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@gov.in or user@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#047d48] focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Verification OTP
                </label>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    name="otp"
                    required
                    placeholder="Enter 6-digit OTP"
                    value={formData.otp}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-3.5 text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:border-[#047d48] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  required
                  placeholder="Minimum 8 characters"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#047d48] focus:bg-white focus:outline-none"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#047d48] hover:bg-[#03663a] py-2.5 text-sm font-semibold text-white shadow-sm transition-all active:scale-[0.99]"
          >
            <span>{step === 1 ? "Send Verification OTP" : "Update Password"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="pt-2 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </form>
      ) : (
        <div className="text-center py-4 space-y-3">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-[#047d48]">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-slate-900">
            Password Reset Successfully!
          </p>
          <p className="text-xs text-slate-500">
            You can now sign in using your updated credentials.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-[#047d48] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#03663a]"
          >
            <span>Return to Login</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default ForgetPassword;

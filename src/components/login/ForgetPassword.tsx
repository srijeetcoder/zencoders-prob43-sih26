import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, KeyRound, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2, Loader2, Phone, Sparkles } from "lucide-react";
import { authApi } from "../../services/api";

function ForgetPassword() {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.email.trim()) return;

    setIsSubmitting(true);
    setError("");
    try {
      await authApi.forgotPassword(formData.email.trim());
      setStep(2);
    } catch (err: any) {
      setError(err?.message || "Failed to dispatch verification OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.otp.trim() || !formData.newPassword.trim()) {
      setError("Please provide the 6-digit OTP and your new password.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      await authApi.resetPassword({
        email: formData.email.trim(),
        otp: formData.otp.trim(),
        newPassword: formData.newPassword.trim(),
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || "Invalid or expired OTP. Please verify and try again.");
    } finally {
      setIsSubmitting(false);
    }
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
            ? "Enter your registered email address to receive an Email & SMS OTP."
            : `Enter the 6-digit OTP sent to ${formData.email} to verify and reset.`}
        </p>
      </div>

      {error && (
        <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
          {error}
        </div>
      )}

      {!success ? (
        <form onSubmit={step === 1 ? handleSendOtp : handleResetPassword} className="space-y-3.5">
          {step === 1 && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Registered Email / Official ID
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@gov.in or citizen@example.com"
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
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    6-Digit Verification OTP
                  </label>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-[11px] font-semibold text-emerald-700 hover:underline"
                  >
                    Resend Code
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    name="otp"
                    required
                    maxLength={6}
                    placeholder="e.g. 842109"
                    value={formData.otp}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-3.5 text-sm font-mono tracking-widest text-slate-900 placeholder:text-slate-400 focus:border-[#047d48] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  New Security Password
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
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#047d48] hover:bg-[#03663a] py-2.5 text-sm font-semibold text-white shadow-sm transition-all active:scale-[0.99] disabled:opacity-75"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing Request...</span>
              </>
            ) : (
              <>
                <span>{step === 1 ? "Send Email & SMS OTP" : "Verify & Update Password"}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
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

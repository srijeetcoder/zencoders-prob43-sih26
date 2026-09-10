import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import LoginForm from "../components/login/LoginForm";

function Login() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-slate-50 via-[#f0f9f5]/50 to-slate-100/90 px-4 py-12">
      {/* Top Left Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white/95 px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs backdrop-blur-sm transition-all hover:bg-slate-50 hover:text-emerald-700 hover:border-emerald-300"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      <LoginForm />
    </div>
  );
}

export default Login;


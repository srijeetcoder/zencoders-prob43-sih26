import Nav from "../components/landing/Nav";
import LoginForm from "../components/login/LoginForm";
import AuthBackgroundSlider from "../components/auth/AuthBackgroundSlider";

function Login() {
  return (
    <div className="relative min-h-screen text-slate-800 flex flex-col justify-between overflow-hidden">
      {/* Moving Background Photo Frames */}
      <AuthBackgroundSlider />

      {/* Top Navigation Bar */}
      <div className="relative z-20">
        <Nav />
      </div>

      {/* Login Main Content Container */}
      <main className="container-page flex-1 flex flex-col items-center justify-center py-4 sm:py-6 relative z-10">
        <div className="w-full max-w-lg">
          <LoginForm />
        </div>
      </main>

      {/* Bottom Minimal Info */}
      <footer className="relative z-10 text-center py-2 text-[11px] text-slate-300 backdrop-blur-xs select-none">
        © 2026 PooKar · National Citizen & Public Problem Governance Ledger
      </footer>
    </div>
  );
}

export default Login;


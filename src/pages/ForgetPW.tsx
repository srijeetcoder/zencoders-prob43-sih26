import Nav from "../components/landing/Nav";
import ForgetPassword from "../components/login/ForgetPassword";
import AuthBackgroundSlider from "../components/auth/AuthBackgroundSlider";

function ForgetPW() {
  return (
    <div className="relative min-h-screen text-slate-800 flex flex-col justify-between overflow-hidden">
      <AuthBackgroundSlider />
      <div className="relative z-20">
        <Nav />
      </div>
      <main className="container-page flex-1 flex flex-col items-center justify-center py-6 relative z-10">
        <ForgetPassword />
      </main>
      <footer className="relative z-10 text-center py-2 text-[11px] text-slate-300 backdrop-blur-xs select-none">
        © 2026 PooKar · National Citizen & Public Problem Governance Ledger
      </footer>
    </div>
  );
}

export default ForgetPW;

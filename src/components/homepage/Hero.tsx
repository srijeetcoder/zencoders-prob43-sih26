import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="px-8 py-8">
      <div className="rounded-3xl bg-emerald-50 px-8 py-10">

        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-medium text-emerald-600">
            Welcome to Pukaar
          </p>

          <h1 className="text-4xl font-bold leading-tight text-[#10245e]">
            Your voice can make
            <br />
            a <span className="text-[#087f5b]">difference</span>.
          </h1>

          <p className="mt-4 max-w-xl text-base leading-7 mb-5 text-slate-600">
            Report problems, share ideas, and work together
            to build a better community.
          </p>

          <Link to="/userdashboard"
            className="
              mt-6 rounded-xl
              bg-emerald-600
              px-6 py-3
              text-sm font-semibold
              text-white
              hover:bg-emerald-700
            "
          >
            Report a Problem
          </Link>
        </div>

      </div>
    </section>
  );
}

export default Hero;

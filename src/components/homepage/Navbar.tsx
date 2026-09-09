import { Search, Bell, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-slate-200 bg-white px-6">
      <div className="flex h-full items-center justify-between">

        <div className="relative w-80">
          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search problems..."
            className="
              w-full rounded-xl
              border border-slate-200
              bg-slate-50
              py-2.5 pl-10 pr-4
              text-sm
              outline-none
              focus:border-emerald-400
            "
          />
        </div>

        <div className="flex items-center gap-5">
          <button
            className="
              relative rounded-xl p-2.5
              text-slate-600
              hover:bg-slate-100
            "
          >
            <Bell size={20} />

            <span className="
              absolute right-2 top-2
              h-2 w-2
              rounded-full
              bg-red-500"
            />
          </button>

          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="
              flex h-9 w-9
              items-center justify-center
              rounded-full
              bg-emerald-100
              font-semibold
              text-emerald-700
            ">
              U
            </div>

            <div className="text-left">
              <p className="text-sm font-semibold text-[#10245e]">
                User
              </p>
              <p className="text-xs text-slate-500">
                Citizen
              </p>
            </div>

            <ChevronDown size={17} className="text-slate-400" />
          </Link>

        </div>
      </div>
    </header>
  );
}

export default Navbar;

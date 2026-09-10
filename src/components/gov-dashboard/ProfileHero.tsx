import { Building2, MapPin, Award, Shield } from "lucide-react";

const profileData = {
  name: "Arun Mehta",
  role: "Government Official",
  organization: "Ministry of Jal Shakti",
  location: "New Delhi, India",
  departmentId: "GOV-IN-7742",
  profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces",
  bannerImage: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&h=300&fit=crop",
};

function ProfileHero() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950 to-[#164e63] p-6 text-white shadow-md mx-5 mt-5">
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative flex h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-emerald-400/40 bg-white/10 shadow-lg">
            <img
              src={profileData.profileImage}
              alt={profileData.name}
              className="h-full w-full object-cover"
            />
            <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-slate-900 bg-emerald-400" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-white">
                {profileData.name}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/30">
                <Shield className="h-3 w-3" />
                Verified Official
              </span>
            </div>

            <p className="mt-1 text-sm font-medium text-cyan-200">
              {profileData.role} · <span className="font-mono text-xs">{profileData.departmentId}</span>
            </p>

            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-cyan-400" />
                <span>{profileData.organization}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                <span>{profileData.location}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-5 py-3.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
            <Award className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">National Innovation Desk</p>
            <p className="text-[11px] text-cyan-200">Department of Drinking Water & Sanitation</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHero;

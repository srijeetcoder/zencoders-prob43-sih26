import { User, IdCard, MapPin, Building2, ShieldCheck } from "lucide-react";

interface UserProfileProps {
  name: string;
  role: string;
  id: string;
  location: string;
  organization: string;
  avatarUrl?: string;
}

function UserProfileCard({
  name,
  role,
  id,
  location,
  organization,
  avatarUrl,
}: UserProfileProps) {
  return (
    <div className="relative flex flex-col md:flex-row items-start md:items-center gap-5 rounded-2xl border border-slate-200/80 bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-white p-6 shadow-sm">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-emerald-200 bg-white text-emerald-700 shadow-inner">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-emerald-100/70 text-2xl font-bold text-emerald-800">
            {name.charAt(0)}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-xl font-bold text-[#10245e]">{name}</h1>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
            <ShieldCheck size={13} />
            {role}
          </span>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-600">
          <span className="flex items-center gap-1.5 font-medium">
            <IdCard className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-mono text-slate-700">ID: {id}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4 text-emerald-600 shrink-0" />
            {organization}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
            {location}
          </span>
        </div>
      </div>
    </div>
  );
}

export default UserProfileCard;

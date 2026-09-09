import { User, IdCard, MapPin, Building2 } from "lucide-react";

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
    <div className="flex items-center gap-5 rounded-xl bg-blue-50 p-6">
      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gray-200">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <User className="h-10 w-10 text-gray-400" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-bold text-blue-950">{name}</h1>
        <p className="text-sm text-gray-600">{role}</p>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
          <span className="flex items-center gap-1.5">
            <IdCard className="h-4 w-4 shrink-0" />
            <span className="font-mono text-xs">ID: {id}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4 shrink-0" />
            {organization}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0" />
            {location}
          </span>
        </div>
      </div>
    </div>
  );
}

export default UserProfileCard;

import { Building2, MapPin, User } from "lucide-react";

const profileData = {
  name: "Arun Mehta",
  role: "Government Official",
  organization: "Ministry of Education",
  location: "New Delhi, India",
  profileImage: "",
  bannerImage: "",
};

function ProfileHero() {
  return (
    <div className="flex items-center justify-between rounded-xl bg-blue-50 p-6">

      <div className="flex items-center gap-5">

        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gray-200">
          {profileData.profileImage ? (
            <img 
              src={profileData.profileImage}
              className="h-full w-full object-cover"
            />) : (
              <User className="h-12 w-12 text-gray-400" /> 
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold text-blue-950">
            {profileData.name}
          </h1>

          <p className="mt-2 text-gray-600">
            {profileData.role}
          </p>

          <div className="mt-2 flex items-center gap-2 whitespace-nowrap text-gray-600">
            <Building2 className="h-5 w-5 shrink-0" />
            <span>{profileData.role}</span>
          </div>

          <div className="mt-1 flex items-center gap-2 whitespace-nowrap text-gray-500">
            <MapPin className="h-5 w-5 shrink-0" />
            <span>{profileData.location}</span>
          </div>
        </div>

      </div>

      <div className="flex h-36 w-2/5 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white/40">
        {profileData.bannerImage ? (
            <img 
              src={profileData.bannerImage}
              className="h-full w-full object-cover"
            />) : (
              <span className="text-gray-400">
                Banner
              </span>
          )}
      </div>
    </div>
  );
}

export default ProfileHero;

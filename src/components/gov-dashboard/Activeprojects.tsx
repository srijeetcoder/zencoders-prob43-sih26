type Status = "Planning" | "In Progress" | "Testing" | "Completed";

interface Project {
  id: string;
  name: string;
  thumbnail: string;
  domain: string;
  location: string;
  partner: string;
  status: Status;
}

const STATUS_STYLES: Record<Status, string> = {
  Planning: "bg-blue-50 text-blue-700",
  "In Progress": "bg-emerald-50 text-emerald-700",
  Testing: "bg-teal-50 text-teal-700",
  Completed: "bg-slate-100 text-slate-600",
};

const projects: Project[] = [
  {
    id: "1",
    name: "Solar Water Purification",
    thumbnail:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=100&h=100&fit=crop",
    domain: "Environment",
    location: "Purulia, WB",
    partner: "IIT Kharagpur",
    status: "In Progress",
  },
  {
    id: "2",
    name: "Smart Street Lighting",
    thumbnail:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=100&h=100&fit=crop",
    domain: "Infrastructure",
    location: "Durgapur, WB",
    partner: "Jadavpur University",
    status: "Testing",
  },
  {
    id: "3",
    name: "AI-based Crop Disease Detection",
    thumbnail:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=100&h=100&fit=crop",
    domain: "Agriculture",
    location: "Bankura, WB",
    partner: "MAKAUT",
    status: "In Progress",
  },
  {
    id: "4",
    name: "Community Health Kiosk",
    thumbnail:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&h=100&fit=crop",
    domain: "Healthcare",
    location: "Malda, WB",
    partner: "Tata Projects",
    status: "Planning",
  },
];

function ActiveProjects() {
  return (
    <div className="h-full rounded-xl border border-slate-200 bg-white px-5 py-4 mx-5 my-2 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">
          Active Projects (Recent)
        </h3>
        <button
          type="button"
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View all
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M12.79 5.23a.75.75 0 011.06 0l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 11-1.06-1.06l3.22-3.22H3a.75.75 0 010-1.5h12.94l-3.22-3.22a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-medium text-slate-500">
              <th className="pb-2 pr-4 font-medium">Project</th>
              <th className="pb-2 pr-4 font-medium">Domain</th>
              <th className="pb-2 pr-4 font-medium">Location</th>
              <th className="pb-2 pr-4 font-medium">Partner</th>
              <th className="pb-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr
                key={project.id}
                className="border-b border-slate-50 last:border-0"
              >
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={project.thumbnail}
                      alt=""
                      className="h-9 w-9 shrink-0 rounded-lg object-cover"
                    />
                    <span className="font-medium text-slate-900">
                      {project.name}
                    </span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-slate-600">{project.domain}</td>
                <td className="py-3 pr-4 text-slate-600">
                  {project.location}
                </td>
                <td className="py-3 pr-4 text-slate-600">
                  {project.partner}
                </td>
                <td className="py-3">
                  <span
                    className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
                      STATUS_STYLES[project.status]
                    }`}
                  >
                    {project.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ActiveProjects;

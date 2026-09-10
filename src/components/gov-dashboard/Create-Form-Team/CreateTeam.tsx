import { useState } from "react";
import {
  Users,
  UserPlus,
  Target,
  Building2,
  Sparkles,
  Check,
  Wand2,
} from "lucide-react";

const DOMAINS = [
  "Infrastructure",
  "Healthcare",
  "Environment",
  "Education",
  "Agriculture",
  "Others",
];

const matchedTeams = [
  {
    name: "Team Jal Setu",
    expertise: "Water Infrastructure",
    institution: "IIT (ISM) Dhanbad",
    match: 94,
  },
  {
    name: "Swasthya Mitra",
    expertise: "Public Health",
    institution: "RIMS Ranchi",
    match: 89,
  },
  {
    name: "Eco-Wards",
    expertise: "Solid Waste & Climate",
    institution: "BIT Mesra",
    match: 82,
  },
];

const steps = [
  { title: "Report the problem", detail: "Citizens submit issues in any district of Jharkhand." },
  { title: "AI matches teams", detail: "Our engine matches problems to teams by domain and location." },
  { title: "Team forms & plans", detail: "Universities and students assemble to create a solution plan." },
  { title: "Track to resolution", detail: "The district administration tracks the project to completion." },
];

function CreateTeam() {
  const [teamName, setTeamName] = useState("");
  const [domain, setDomain] = useState(DOMAINS[0]);
  const [objective, setObjective] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [memberInput, setMemberInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const addMember = () => {
    const name = memberInput.trim();
    if (name && !members.includes(name)) {
      setMembers((prev) => [...prev, name]);
    }
    setMemberInput("");
  };

  const removeMember = (name: string) => {
    setMembers((prev) => prev.filter((member) => member !== name));
  };

  const handleSubmit = () => {
    // wire this up to your API call later
    console.log({ teamName, domain, objective, members });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  };

  return (
    <div className="px-6 py-6 sm:px-8">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-800 to-teal-600 text-white">
          <Users size={24} />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-navy-900">Create / Form Team</h1>
          <p className="text-sm text-slate-500">
            Assemble a team to solve a civic problem · टीम बनाएँ
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Form */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-navy-900">Team Details</h2>

          <div className="mt-5 space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-900">
                Team Name
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. Jal Setu Ranchi"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-900">
                Problem Domain
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-teal-400"
              >
                {DOMAINS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-900">
                Objective
              </label>
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="What civic problem will your team solve?"
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-900">
                Team Members
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addMember();
                    }
                  }}
                  placeholder="Add a member name and press Enter"
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-teal-400"
                />
                <button
                  type="button"
                  onClick={addMember}
                  className="flex items-center gap-1.5 rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
                >
                  <UserPlus size={16} />
                  Add
                </button>
              </div>

              {members.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {members.map((member) => (
                    <span
                      key={member}
                      className="flex items-center gap-1.5 rounded-full bg-navy-100 px-3 py-1 text-xs font-medium text-navy-800"
                    >
                      {member}
                      <button
                        type="button"
                        onClick={() => removeMember(member)}
                        className="text-navy-400 hover:text-rose-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!teamName.trim() || !objective.trim() || members.length === 0}
              className="w-full rounded-xl bg-teal-500 py-3 text-sm font-semibold text-navy-950 transition-colors hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitted ? "Team Created! · टीम बन गई" : "Create Team"}
            </button>
          </div>
        </div>

        {/* Live preview + matches */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-brand-200 bg-brand-50 p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-navy-900">
              <Wand2 size={18} className="text-brand-600" />
              Live Preview
            </h2>

            <div className="mt-4 rounded-2xl bg-white p-5 ring-1 ring-brand-100">
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-navy-900">
                  {teamName.trim() || "Untitled Team"}
                </p>
                <span className="rounded-full bg-navy-900 px-3 py-1 text-xs font-medium text-white">
                  {domain}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-600">
                {objective.trim() || "Objective not set yet."}
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-navy-700">
                <Building2 size={14} />
                {members.length === 0
                  ? "No members yet"
                  : `${members.length} member${members.length > 1 ? "s" : ""} · ${members.join(", ")}`}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-navy-900">
              <Target size={18} className="text-teal-600" />
              Matched Teams Nearby
            </h2>

            <div className="mt-4 space-y-3">
              {matchedTeams.map((team) => (
                <div
                  key={team.name}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4"
                >
                  <div>
                    <p className="flex items-center gap-2 text-sm font-semibold text-navy-900">
                      {team.name}
                      <span className="flex items-center gap-0.5 rounded-full bg-teal-100 px-2 py-0.5 text-[11px] font-medium text-teal-700">
                        <Sparkles size={11} />
                        {team.match}% match
                      </span>
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {team.expertise} · {team.institution}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="flex items-center gap-1 rounded-xl border border-navy-200 px-3 py-2 text-xs font-semibold text-navy-800 transition-colors hover:bg-navy-50"
                  >
                    <Check size={14} />
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How matching works */}
      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-navy-900">
          How Team Matching Works
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="relative rounded-2xl bg-slate-50 p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500 font-bold text-white">
                {index + 1}
              </span>
              <p className="mt-3 text-sm font-semibold text-navy-900">
                {step.title}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {step.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CreateTeam;
import { useState } from "react";
import {
  Settings,
  Save,
  Mail,
  MessageSquareText,
  Bell,
  ShieldCheck,
} from "lucide-react";

const DISTRICTS = [
  "Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum",
  "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara",
  "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu",
  "Ramgarh", "Ranchi", "Sahebganj", "Seraikela-Kharsawan", "Simdega", "West Singhbhum",
];

const LANGUAGES = ["English", "Hindi", "Hindi + English"];

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-teal-500" : "bg-slate-200"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
          checked ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

function SettingsPage() {
  const [name, setName] = useState("User");
  const [designation, setDesignation] = useState("Block Officer");
  const [department, setDepartment] = useState("Department of Rural Development");
  const [district, setDistrict] = useState("Ranchi");
  const [language, setLanguage] = useState(LANGUAGES[2]);
  const [toggles, setToggles] = useState({
    caseAssignments: true,
    escalationAlerts: true,
    weeklyDigest: true,
    smsNotifications: false,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    console.log({
      name,
      designation,
      department,
      district,
      language,
      toggles,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="px-6 py-6 sm:px-8">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-800 to-teal-600 text-white">
          <Settings size={24} />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-navy-900">Settings</h1>
          <p className="text-sm text-slate-500">
            Profile, language & notification preferences · सेटिंग्स
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Profile */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-navy-900">
            Government Profile
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-navy-900">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-900">
                Designation
              </label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-900">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-900">
                District
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-teal-400"
              >
                {DISTRICTS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Language */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-navy-900">Language</h2>
            <p className="mt-1 text-xs text-slate-500">
              Interface language preference · भाषा चुनें
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    language === lang
                      ? "bg-navy-900 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-navy-900">
              <Bell size={18} className="text-teal-600" />
              Notifications
            </h2>

            <div className="mt-4 divide-y divide-slate-100">
              {[
                { key: "caseAssignments", label: "Case assignments", icon: Mail },
                { key: "escalationAlerts", label: "Escalation alerts", icon: ShieldCheck },
                { key: "weeklyDigest", label: "Weekly digest", icon: MessageSquareText },
                { key: "smsNotifications", label: "SMS notifications", icon: Bell },
              ].map(({ key, label, icon: Icon }) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-3"
                >
                  <span className="flex items-center gap-2.5 text-sm font-medium text-navy-900">
                    <Icon size={16} className="text-slate-400" />
                    {label}
                  </span>
                  <Toggle
                    checked={toggles[key as keyof typeof toggles]}
                    onChange={(value) =>
                      setToggles((prev) => ({ ...prev, [key]: value }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-navy-950 transition-colors hover:bg-teal-400"
        >
          <Save size={15} />
          {saved ? "Saved! · सुरक्षित" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
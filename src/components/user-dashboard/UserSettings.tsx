import { useState, useEffect } from "react";
import { Mail, Phone, Moon, Sun, Pencil, Save, X } from "lucide-react";

interface UserSettingsProps {
  email: string;
  phone: string;
  darkMode: boolean;
  onUpdateDetails?: (data: { email: string; phone: string }) => void;
  onToggleDarkMode?: (enabled: boolean) => void;
}

function UserSettings({
  email: initialEmail,
  phone: initialPhone,
  darkMode: initialDarkMode,
  onUpdateDetails,
  onToggleDarkMode,
}: UserSettingsProps) {
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [darkMode, setDarkMode] = useState(initialDarkMode);

  const [editEmail, setEditEmail] = useState(initialEmail);
  const [editPhone, setEditPhone] = useState(initialPhone);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setEmail(initialEmail);
    setPhone(initialPhone);
    setEditEmail(initialEmail);
    setEditPhone(initialPhone);
  }, [initialEmail, initialPhone]);

  useEffect(() => {
    setDarkMode(initialDarkMode);
  }, [initialDarkMode]);

  const startEditing = () => {
    setEditEmail(email);
    setEditPhone(phone);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setEmail(editEmail);
    setPhone(editPhone);
    setIsEditing(false);

    if (onUpdateDetails) {
      onUpdateDetails({ email: editEmail, phone: editPhone });
    }
  };

  const handleDarkModeToggle = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    onToggleDarkMode?.(newValue);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">
          Account Settings
        </h3>

        {!isEditing ? (
          <button
            type="button"
            onClick={startEditing}
            className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              Save
            </button>
            <button
              type="button"
              onClick={cancelEditing}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Mail className="h-4 w-4" />
            Email Address
          </label>

          {isEditing ? (
            <input
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          ) : (
            <p className="mt-1 text-sm text-slate-900">{email}</p>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Phone className="h-4 w-4" />
            Phone Number
          </label>

          {isEditing ? (
            <input
              type="tel"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          ) : (
            <p className="mt-1 text-sm text-slate-900">{phone}</p>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2">
            {darkMode ? (
              <Moon className="h-4 w-4 text-slate-600" />
            ) : (
              <Sun className="h-4 w-4 text-slate-600" />
            )}
            <span className="text-sm font-medium text-slate-700">Dark Mode</span>
          </div>

          <button
            type="button"
            onClick={handleDarkModeToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              darkMode ? "bg-blue-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                darkMode ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserSettings;

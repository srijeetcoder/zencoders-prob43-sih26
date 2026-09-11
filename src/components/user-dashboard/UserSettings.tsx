import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, User, Pencil, Save, X, LogOut, Trash2, AlertTriangle, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { INDIA_STATES_DISTRICTS } from "../../data/indiaStatesDistricts";

interface UserSettingsProps {
  email: string;
  phone: string;
  name?: string;
  district?: string;
  darkMode?: boolean;
}

function UserSettings({
  email,
  phone,
  name: initialName = "Citizen",
  district: initialDistrict = "Ranchi",
}: UserSettingsProps) {
  const { updateProfile, logout, deleteAccount } = useAuth();
  
  const [name, setName] = useState(initialName);
  const [district, setDistrict] = useState(initialDistrict);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Account Deletion Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const districts =
    INDIA_STATES_DISTRICTS.find((s) => s.state === "Jharkhand")?.districts || [
      "Ranchi",
      "Dhanbad",
      "Bokaro",
      "East Singhbhum",
      "Palamu",
      "Hazaribagh",
      "Deoghar",
      "Dumka",
    ];

  useEffect(() => {
    setName(initialName);
    setDistrict(initialDistrict);
  }, [initialName, initialDistrict]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({ name, district });
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      setDeleteError("Please type 'DELETE' to confirm account deletion.");
      return;
    }

    setIsDeleting(true);
    setDeleteError("");

    try {
      await deleteAccount();
      setShowDeleteModal(false);
      window.location.href = "/";
    } catch (err: any) {
      setDeleteError(err?.message || "Failed to delete account. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Citizen Profile & Account Settings
          </h3>
          <p className="text-xs text-slate-500">
            Manage your verified identity and regional jurisdiction preferences.
          </p>
        </div>

        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5 text-emerald-600" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 rounded-xl bg-[#047d48] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#03663a] disabled:opacity-75 transition-all"
            >
              {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => {
                setName(initialName);
                setDistrict(initialDistrict);
                setIsEditing(false);
              }}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </button>
          </div>
        )}
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Profile changes successfully updated in the state ledger.</span>
        </div>
      )}

      {/* Profile Form Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name (Editable) */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <User className="h-3.5 w-3.5 text-emerald-600" />
            Full Legal Name
          </label>
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 px-3 text-xs sm:text-sm outline-none focus:border-emerald-600 focus:bg-white transition-colors"
            />
          ) : (
            <p className="rounded-xl bg-slate-50 border border-slate-100 py-2 px-3 text-xs sm:text-sm font-semibold text-slate-900">
              {name}
            </p>
          )}
        </div>

        {/* District Jurisdiction (Editable) */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
            Primary District Jurisdiction
          </label>
          {isEditing ? (
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 px-3 text-xs sm:text-sm outline-none focus:border-emerald-600 focus:bg-white transition-colors"
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}, Jharkhand
                </option>
              ))}
            </select>
          ) : (
            <p className="rounded-xl bg-slate-50 border border-slate-100 py-2 px-3 text-xs sm:text-sm font-semibold text-slate-900">
              {district}, Jharkhand
            </p>
          )}
        </div>

        {/* Email Address (Strictly Read-Only) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              Verified Email Address
            </label>
            <span className="text-[10px] font-mono text-slate-400 uppercase bg-slate-100 px-1.5 py-0.5 rounded">
              Immutable
            </span>
          </div>
          <p className="rounded-xl bg-slate-100/80 border border-slate-200/80 py-2 px-3 text-xs sm:text-sm text-slate-600 select-all font-mono">
            {email}
          </p>
        </div>

        {/* Phone Number (Verified) */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Phone className="h-3.5 w-3.5 text-slate-400" />
            Registered Mobile
          </label>
          <p className="rounded-xl bg-slate-100/80 border border-slate-200/80 py-2 px-3 text-xs sm:text-sm text-slate-600 font-mono">
            {phone}
          </p>
        </div>
      </div>

      {/* Account Actions Section */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => logout()}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2 px-4 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5 text-slate-500" />
          <span>Sign Out from Device</span>
        </button>

        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/60 py-2 px-4 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5 text-rose-600" />
          <span>Delete Account Permanently</span>
        </button>
      </div>

      {/* Account Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-rose-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-rose-100 text-rose-700">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div className="text-center">
              <h4 className="text-lg font-bold text-slate-900">Delete Citizen Account?</h4>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                This action is permanent and cannot be undone. All your reported bottlenecks, personal audit trails, and citizen ledger tokens will be deleted.
              </p>
            </div>

            {deleteError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs font-medium text-rose-700 text-center">
                {deleteError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block text-center">
                Type <span className="font-mono text-rose-600 font-extrabold">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full text-center font-mono font-bold tracking-widest rounded-xl border border-rose-300 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                  setDeleteError("");
                }}
                className="rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeleting || deleteConfirmText !== "DELETE"}
                className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white py-2 text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserSettings;

import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, ImagePlus, X, Lock, LogIn, UserPlus, ShieldAlert, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function ReportProblemPage() {
  const { user, isAuthenticated } = useAuth();
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [comments, setComments] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Restrict for logged-out citizens
  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl rounded-3xl border border-slate-200/90 bg-white p-8 text-center shadow-xl shadow-slate-900/5 backdrop-blur-md md:p-10">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-inner">
            <Lock className="h-9 w-9 text-emerald-600" />
          </div>

          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/90 px-3.5 py-1 text-xs font-semibold text-emerald-800">
            <ShieldAlert size={14} />
            Citizen Verification Required
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#10245e] md:text-3xl">
            Sign In to Report a Problem
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
            To ensure genuine civic accountability and attach problem updates to your personal ledger, reporting is restricted to verified citizen accounts.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              to="/login?redirect=/problem"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#148554] px-5 py-3 text-sm font-bold text-white shadow-md shadow-emerald-900/10 hover:bg-[#107046] transition-all hover:-translate-y-0.5"
            >
              <LogIn className="h-4 w-4" />
              Login to Report
            </Link>

            <Link
              to="/register?role=citizen"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all hover:-translate-y-0.5"
            >
              <UserPlus className="h-4 w-4 text-emerald-600" />
              Register as Citizen
            </Link>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4 flex justify-center">
            <Link to="/main" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Home Feed
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setImages((prev) => [...prev, ...Array.from(files)]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setLocation("");
    setDescription("");
    setComments("");
    setImages([]);
  };

  const handleSubmit = () => {
    // wire this up to your API call
    console.log({ location, description, comments, images });
    handleReset();
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full flex-col px-6 py-8">
      <div
        className="
          flex w-full flex-1 flex-col
          rounded-xl border border-slate-200
          bg-white
        "
      >
        <div className="border-b border-slate-200 px-6 py-5">
          <p className="text-lg font-semibold text-[#10245e]">
            Report a Problem
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Let us know what's going on in your area.
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-5 px-6 py-6">
          <div className="flex max-w-[640px] gap-2">
            <div className="relative flex-1">
              <MapPin
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Street, area, or landmark"
                className="
                  w-full rounded-xl
                  border border-slate-200
                  bg-slate-50
                  py-2.5 pl-10 pr-4
                  text-sm text-[#263968]
                  outline-none
                  focus:border-emerald-400
                "
              />
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="
                flex items-center gap-2
                whitespace-nowrap rounded-xl
                border border-slate-200
                bg-slate-50
                px-3.5 py-2.5
                text-sm font-medium text-[#263968]
                hover:bg-slate-100
              "
            >
              <ImagePlus size={16} />
              Add pictures
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          {images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {images.map((file, index) => (
                <div
                  key={index}
                  className="relative h-16 w-16 overflow-hidden rounded-lg border border-slate-200"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="
                      absolute right-0.5 top-0.5
                      rounded-full bg-black/60
                      p-0.5 text-white
                      hover:bg-black/80
                    "
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-1 flex-col gap-5">
            <div className="flex flex-1 flex-col">
              <label className="mb-2 block text-sm font-semibold text-[#10245e]">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's the problem? Be as specific as you can."
                className="
                  w-full flex-1 resize-none rounded-xl
                  border border-slate-200
                  bg-slate-50
                  px-4 py-3
                  text-sm text-[#263968]
                  outline-none
                  focus:border-emerald-400
                "
              />
            </div>

            <div className="flex flex-1 flex-col">
              <label className="mb-2 block text-sm font-semibold text-[#10245e]">
                Additional comments
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Anything else worth mentioning? (optional)"
                className="
                  w-full flex-1 resize-none rounded-xl
                  border border-slate-200
                  bg-slate-50
                  px-4 py-3
                  text-sm text-[#263968]
                  outline-none
                  focus:border-emerald-400
                "
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
          <button
            onClick={handleReset}
            className="text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            Discard
          </button>

          <button
            onClick={handleSubmit}
            disabled={!location || !description}
            className="
              rounded-xl bg-emerald-600
              px-5 py-2.5
              text-sm font-semibold text-white
              hover:bg-emerald-700
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            Submit Problem
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportProblemPage;

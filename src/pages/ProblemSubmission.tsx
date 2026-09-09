import { useRef, useState } from "react";
import { MapPin, ImagePlus, X } from "lucide-react";

function ReportProblemPage() {
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [comments, setComments] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

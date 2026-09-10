import vidhanSabhaImg from "../../assets/auth-bg/jharkhand-vidhan-sabha.jpg";
import educationImg from "../../assets/auth-bg/jharkhand-education.jpg";
import agricultureImg from "../../assets/auth-bg/jharkhand-agriculture.jpg";
import miningImg from "../../assets/auth-bg/jharkhand-mining.jpg";
import machineryImg from "C:/Users/srije/.gemini/antigravity-ide/brain/c8a70e01-f5d8-478b-9ea5-0930f9d845bf/.user_uploaded/media_1789055673816.jpg";

// The 5 official authentic Jharkhand domain images provided by the user
const IMAGES = [
  agricultureImg,
  educationImg,
  vidhanSabhaImg,
  miningImg,
  machineryImg,
];

// 5 rows with varied image order for visual variety
const ROW_CONFIGS = [
  {
    images: [IMAGES[0], IMAGES[1], IMAGES[2], IMAGES[3], IMAGES[4]],
    animationClass: "animate-auth-slider-left",
  },
  {
    images: [IMAGES[2], IMAGES[3], IMAGES[4], IMAGES[0], IMAGES[1]],
    animationClass: "animate-auth-slider-right",
  },
  {
    images: [IMAGES[1], IMAGES[4], IMAGES[0], IMAGES[3], IMAGES[2]],
    animationClass: "animate-auth-slider-left-fast",
  },
  {
    images: [IMAGES[3], IMAGES[2], IMAGES[1], IMAGES[4], IMAGES[0]],
    animationClass: "animate-auth-slider-right-fast",
  },
  {
    images: [IMAGES[4], IMAGES[0], IMAGES[2], IMAGES[1], IMAGES[3]],
    animationClass: "animate-auth-slider-left",
  },
];

export default function AuthBackgroundSlider() {
  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0 select-none bg-slate-950 flex flex-col justify-between py-2 gap-2 sm:gap-3"
      aria-hidden="true"
    >
      {/* 5 Rows of side-by-side moving photos filling the entire screen height */}
      {ROW_CONFIGS.map((row, rowIdx) => {
        // Duplicate array multiple times to ensure seamless infinite looping on any screen width
        const duplicated = [
          ...row.images,
          ...row.images,
          ...row.images,
          ...row.images,
          ...row.images,
          ...row.images,
        ];

        return (
          <div key={rowIdx} className="flex-1 w-full overflow-hidden flex items-center min-h-0">
            <div className={`flex items-center gap-2.5 sm:gap-4 w-max ${row.animationClass}`}>
              {duplicated.map((imgSrc, imgIdx) => (
                <div
                  key={`${rowIdx}-${imgIdx}`}
                  className="shrink-0 h-full max-h-[19vh] aspect-[16/10] sm:aspect-[16/9] rounded-xl sm:rounded-2xl overflow-hidden shadow-md shadow-black/40 border border-white/10"
                >
                  <img
                    src={imgSrc}
                    alt=""
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                    loading="eager"
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Subtle overlay wash for optimal contrast and clean readability */}
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[0.5px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950/60" />
    </div>
  );
}



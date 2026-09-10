export default function Card({ children, className = "", padding = true }) {
  return (
    <div
      className={`bg-white rounded-xl border border-line shadow-[0_1px_3px_var(--theme-shadow)] ${
        padding ? "p-6" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

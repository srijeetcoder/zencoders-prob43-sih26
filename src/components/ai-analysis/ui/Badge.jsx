const variants = {
  high: "bg-danger-wash text-danger border-danger/20",
  significant: "bg-warning-wash text-warning border-warning/20",
  "major factor": "bg-danger-wash text-danger border-danger/20",
  low: "bg-success-wash text-success border-success/20",
  default: "bg-paper-3 text-ink-2 border-line",
};

export default function Badge({ children, variant = "default" }) {
  const base = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border";
  const styles = variants[variant.toLowerCase()] || variants.default;

  return <span className={`${base} ${styles}`}>{children}</span>;
}

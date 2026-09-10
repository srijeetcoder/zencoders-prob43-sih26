interface EmblemProps {
  size?: number;
  className?: string;
}

function Emblem({ size = 20, className = "" }: EmblemProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.4" />

      {Array.from({ length: 24 }).map((_, index) => {
        const angle = (Math.PI / 12) * index;
        const inner = 2.8;
        const outer = 10.1;
        const x1 = 12 + inner * Math.cos(angle);
        const y1 = 12 + inner * Math.sin(angle);
        const x2 = 12 + outer * Math.cos(angle);
        const y2 = 12 + outer * Math.sin(angle);
        const key = `${x1.toFixed(2)}-${y1.toFixed(2)}`;

        return (
          <line
            key={key}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="0.9"
          />
        );
      })}
    </svg>
  );
}

export default Emblem;
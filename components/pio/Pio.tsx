import type { PioMood } from "./types";

interface PioProps {
  mood?: PioMood;
  size?: number;
  animated?: boolean;
}

export function Pio({ mood = "normal", size = 64, animated = true }: PioProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 110"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`Pio (${mood})`}
      className={animated ? "pio-float" : undefined}
    >
      <defs>
        <radialGradient id="pio-body" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#a7f3d0" />
          <stop offset="60%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#10b981" />
        </radialGradient>
        <radialGradient id="pio-cheek" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fb7185" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="pio-spark-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
      </defs>

      {/* Antenna */}
      <line
        x1="50"
        y1="22"
        x2="50"
        y2="12"
        stroke="#10b981"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Spark on top */}
      <g className={animated ? "pio-spark" : undefined} style={{ transformOrigin: "50px 8px" }}>
        <circle cx="50" cy="8" r="6" fill="url(#pio-spark-grad)" />
        <path
          d="M 50 1 L 51.4 6.6 L 57 8 L 51.4 9.4 L 50 15 L 48.6 9.4 L 43 8 L 48.6 6.6 Z"
          fill="#fef3c7"
        />
      </g>

      {/* Soft ground shadow */}
      <ellipse cx="50" cy="100" rx="26" ry="3.5" fill="#0f172a" opacity="0.08" />

      {/* Body (teardrop) */}
      <path
        d="M 50 22
           C 76 22, 86 50, 86 68
           C 86 86, 70 96, 50 96
           C 30 96, 14 86, 14 68
           C 14 50, 24 22, 50 22 Z"
        fill="url(#pio-body)"
        stroke="#059669"
        strokeWidth="1.6"
      />

      {/* Body highlight */}
      <ellipse cx="36" cy="42" rx="10" ry="6" fill="white" opacity="0.45" />

      {/* Cheeks */}
      <ellipse cx="28" cy="68" rx="7" ry="4" fill="url(#pio-cheek)" />
      <ellipse cx="72" cy="68" rx="7" ry="4" fill="url(#pio-cheek)" />

      {/* Face */}
      <Face mood={mood} animated={animated} />
    </svg>
  );
}

interface FaceProps {
  mood: PioMood;
  animated: boolean;
}

function Face({ mood, animated }: FaceProps) {
  if (mood === "happy") {
    return (
      <g>
        <path
          d="M 32 56 Q 38 50 44 56"
          stroke="#1c1917"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 56 56 Q 62 50 68 56"
          stroke="#1c1917"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 38 70 Q 50 84 62 70 Q 50 78 38 70 Z"
          fill="#1c1917"
        />
        <path d="M 42 76 Q 50 80 58 76" fill="#fb7185" />
      </g>
    );
  }

  if (mood === "thinking") {
    return (
      <g>
        <Eye cx={36} cy={58} pupilDx={1.5} pupilDy={-1.5} animated={animated} />
        <Eye cx={64} cy={58} pupilDx={1.5} pupilDy={-1.5} animated={animated} />
        <circle cx="50" cy="74" r="2.4" fill="#1c1917" />
      </g>
    );
  }

  return (
    <g>
      <Eye cx={36} cy={58} animated={animated} />
      <Eye cx={64} cy={58} animated={animated} />
      <path
        d="M 41 72 Q 50 79 59 72"
        stroke="#1c1917"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

interface EyeProps {
  cx: number;
  cy: number;
  pupilDx?: number;
  pupilDy?: number;
  animated: boolean;
}

function Eye({ cx, cy, pupilDx = 0, pupilDy = 0, animated }: EyeProps) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx="5" ry="6.5" fill="white" />
      <ellipse
        cx={cx + pupilDx}
        cy={cy + pupilDy}
        rx="3"
        ry="4.2"
        fill="#1c1917"
        className={animated ? "pio-blink" : undefined}
        style={{ transformOrigin: `${cx + pupilDx}px ${cy + pupilDy}px` }}
      />
      <circle cx={cx + pupilDx - 1} cy={cy + pupilDy - 1.4} r="0.9" fill="white" />
    </g>
  );
}

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { RotateCcw, Shuffle, TrendingDown, TrendingUp } from 'lucide-react';

const CONTROL_COUNT = 6;
const CONTROL_XS = Array.from(
  { length: CONTROL_COUNT },
  (_, i) => i / (CONTROL_COUNT - 1),
);

const SAMPLE_COUNT = 56;
const SAMPLE_XS = Array.from(
  { length: SAMPLE_COUNT },
  (_, i) => i / (SAMPLE_COUNT - 1),
);

const VB_W = 640;
const VB_H = 340;
const PAD_X = 60;
const PAD_Y = 48;
const plotW = VB_W - PAD_X * 2;
const plotH = VB_H - PAD_Y * 2;

const pixelX = (xFrac: number) => PAD_X + xFrac * plotW;
const pixelY = (yFrac: number) => PAD_Y + (1 - yFrac) * plotH;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function lerpColor(hexA: string, hexB: string, t: number): string {
  const a = parseInt(hexA.slice(1), 16);
  const b = parseInt(hexB.slice(1), 16);
  const ar = (a >> 16) & 255;
  const ag = (a >> 8) & 255;
  const ab = a & 255;
  const br = (b >> 16) & 255;
  const bg = (b >> 8) & 255;
  const bb = b & 255;
  const r = Math.round(lerp(ar, br, t));
  const g = Math.round(lerp(ag, bg, t));
  const bl = Math.round(lerp(ab, bb, t));
  return `rgb(${r}, ${g}, ${bl})`;
}

const DATA_TS = [0.04, 0.14, 0.24, 0.36, 0.48, 0.58, 0.7, 0.8, 0.9, 0.98];
const DATA_NOISE = [
  0.03, -0.025, 0.04, -0.035, 0.02, -0.045, 0.03, -0.02, 0.035, -0.03,
];

// Uniform Catmull-Rom spline through the control heights, evaluated at any
// x-fraction — used both to draw the curve and to score it against trueFn.
function sampleCurve(ys: number[], xFrac: number): number {
  const n = ys.length;
  const t = xFrac * (n - 1);
  let i = Math.floor(t);
  if (i >= n - 1) i = n - 2;
  if (i < 0) i = 0;
  const u = t - i;
  const p0 = ys[Math.max(i - 1, 0)];
  const p1 = ys[i];
  const p2 = ys[i + 1];
  const p3 = ys[Math.min(i + 2, n - 1)];
  const u2 = u * u;
  const u3 = u2 * u;
  return (
    0.5 *
    (2 * p1 +
      (-p0 + p2) * u +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * u3)
  );
}

// Mean squared error between the drawn curve and a theme's true generating
// function — the single source of truth for "is this a good fit."
function mseAgainstTrue(ys: number[], trueFn: (t: number) => number): number {
  let sumSq = 0;
  for (const s of SAMPLE_XS) {
    const d = sampleCurve(ys, s) - trueFn(s);
    sumSq += d * d;
  }
  return sumSq / SAMPLE_XS.length;
}

const FLAT_YS = CONTROL_XS.map(() => 0.5);
const BAD_COLOR = '#c23b2b';
const GOOD_COLOR = '#1f7a4d';

type DecorProps = { size: number; hue: number; style?: CSSProperties };
type FloatProps = {
  top: string;
  duration: number;
  delay: number;
  opacity: number;
};

interface Theme {
  id: string;
  trueFn: (t: number) => number;
  badGradient: string;
  goodGradient: string;
  BadDecor: (props: DecorProps) => JSX.Element;
  GoodDecor: (props: DecorProps) => JSX.Element;
  Floater: (props: FloatProps) => JSX.Element;
}

function TreeShape({ scorched }: { scorched: boolean }) {
  return (
    <>
      <rect x="17" y="42" width="6" height="12" rx="2" fill="#6b4a2f" />
      <path
        d="M20 4L34 26H26L34 34H24L30 42H10L16 34H6L14 26H6L20 4Z"
        fill={scorched ? '#3d2416' : '#1f5c3f'}
      />
      <path
        d="M20 12L30 28H24L29 34H12L17 28H10L20 12Z"
        fill={scorched ? '#5c2f1a' : '#2f7a52'}
        opacity="0.9"
      />
    </>
  );
}

function Tree({ size, style }: DecorProps) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 40 56" className="tree-sway" style={style}>
      <TreeShape scorched={false} />
    </svg>
  );
}

function BurningTree({ size, hue, style }: DecorProps) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 40 56" className="tree-burning" style={style}>
      <TreeShape scorched />
      <g className="flame" style={{ transformOrigin: '20px 24px' }}>
        <path
          d="M20 6C15 12 13 17 15 22C16 25 19 28 21 29C20 26 22 25 21 22C25 26 24 30 21 33C26 30 27 24 24 19C23 22 22 20 22 18C24 14 23 9 20 6Z"
          fill={`hsl(${22 + hue}, 92%, 54%)`}
        />
      </g>
      <g className="flame" style={{ transformOrigin: '14px 30px', animationDelay: '0.3s' }}>
        <path
          d="M13 20C10 24 9 27 11 30C12 32 14 33 15 34C14 32 15 31 14 29C17 32 16 34 14 36C18 34 18 30 16 27C15 29 14 28 14 26C15 24 15 22 13 20Z"
          fill={`hsl(${45 + hue}, 95%, 60%)`}
        />
      </g>
    </svg>
  );
}

function Bird({ top, duration, delay, opacity }: FloatProps) {
  return (
    <div
      className="float-fly"
      style={{ top, animationDuration: `${duration}s`, animationDelay: `${delay}s`, opacity, transition: 'opacity 600ms ease' }}
    >
      <svg width="26" height="16" viewBox="0 0 26 16" className="float-bob">
        <path d="M1 8C5 2 9 2 13 7C17 2 21 2 25 8C21 6 18 7 13 11C8 7 5 6 1 8Z" fill="#1B1B18" />
      </svg>
    </div>
  );
}

function FreshFruit({ size, hue, style }: DecorProps) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 40 46" className="tree-sway" style={style}>
      <path d="M20 8C20 3 24 1 27 3" stroke="#5c3a1f" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M20 6C24 2 30 3 29 9C26 8 22 9 20 6Z" fill="#2f7a52" />
      <circle cx="20" cy="27" r="16" fill={`hsl(${4 + hue}, 72%, 50%)`} />
      <path d="M10 22a11 9 0 0 1 9-7" stroke="#fff" strokeOpacity="0.4" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function RottenFruit({ size, hue, style }: DecorProps) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 40 46" className="tree-burning" style={style}>
      <path d="M20 8C19 4 17 3 16 5" stroke="#4a3a26" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M20 7C17 4 13 5 14 10C17 9 19 9 20 7Z" fill="#4a4025" />
      <ellipse cx="20" cy="29" rx="16" ry="14" fill={`hsl(${28 + hue}, 30%, 28%)`} />
      <circle cx="14" cy="26" r="2.2" fill="#221a10" opacity="0.7" />
      <circle cx="25" cy="32" r="1.8" fill="#221a10" opacity="0.7" />
      <circle cx="22" cy="22" r="1.4" fill="#221a10" opacity="0.6" />
    </svg>
  );
}

function Sparkle({ top, duration, delay, opacity }: FloatProps) {
  return (
    <div
      className="float-fly"
      style={{ top, animationDuration: `${duration}s`, animationDelay: `${delay}s`, opacity, transition: 'opacity 600ms ease' }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" className="float-bob">
        <path d="M9 0L10.5 7.5L18 9L10.5 10.5L9 18L7.5 10.5L0 9L7.5 7.5Z" fill="#fff3c2" />
      </svg>
    </div>
  );
}

function BabySleeping({ size, style }: DecorProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className="tree-sway" style={style}>
      <circle cx="20" cy="20" r="18" fill="#ffe7d6" stroke="#1B1B18" strokeWidth="2" />
      <path d="M10 18 Q13 20 16 18" stroke="#1B1B18" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M24 18 Q27 20 30 18" stroke="#1B1B18" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M16 27 Q20 30 24 27" stroke="#1B1B18" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="10" cy="24" r="2" fill="#e8a5a5" opacity="0.6" />
      <circle cx="30" cy="24" r="2" fill="#e8a5a5" opacity="0.6" />
    </svg>
  );
}

function BabyCrying({ size, style }: DecorProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className="tree-burning" style={style}>
      <circle cx="20" cy="20" r="18" fill="#ffd9c2" stroke="#1B1B18" strokeWidth="2" />
      <path d="M10 14 Q13 10 16 14" stroke="#1B1B18" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M24 14 Q27 10 30 14" stroke="#1B1B18" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="20" cy="27" rx="6" ry="7" fill="#7a1f2b" />
      <path d="M12 18 q-2 4 -1 7" stroke="#4aa8d8" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M28 18 q2 4 1 7" stroke="#4aa8d8" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function FloatingZ({ top, duration, delay, opacity }: FloatProps) {
  return (
    <div
      className="float-fly"
      style={{ top, animationDuration: `${duration}s`, animationDelay: `${delay}s`, opacity, transition: 'opacity 600ms ease' }}
    >
      <span className="float-bob" style={{ display: 'block', fontWeight: 900, color: '#eef1ff', fontSize: 16 }}>
        Z
      </span>
    </div>
  );
}

const THEMES: Theme[] = [
  {
    id: 'forest',
    trueFn: (t) => 0.2 + 0.55 * Math.sin(Math.PI * t),
    badGradient: 'linear-gradient(180deg, #241010 0%, #7a1f1f 40%, #d9622b 75%, #f3b13a 100%)',
    goodGradient: 'linear-gradient(180deg, #dff3e6 0%, #7fc79a 35%, #2f7a52 70%, #12483d 100%)',
    BadDecor: BurningTree,
    GoodDecor: Tree,
    Floater: Bird,
  },
  {
    id: 'fruit',
    trueFn: (t) => 0.75 - 0.5 * Math.sin(Math.PI * t),
    badGradient: 'linear-gradient(180deg, #241f14 0%, #4a3f1f 40%, #6b5a26 75%, #8a7a3a 100%)',
    goodGradient: 'linear-gradient(180deg, #fff3d6 0%, #ffd166 35%, #f4a72c 70%, #e8871b 100%)',
    BadDecor: RottenFruit,
    GoodDecor: FreshFruit,
    Floater: Sparkle,
  },
  {
    id: 'nursery',
    trueFn: (t) => 0.5 + 0.35 * Math.sin(Math.PI * 2 * t),
    badGradient: 'linear-gradient(180deg, #3a1020 0%, #7a1f3d 40%, #c0335f 75%, #e8608a 100%)',
    goodGradient: 'linear-gradient(180deg, #0f1a3d 0%, #24356b 35%, #4a5a9e 70%, #8fa3d9 100%)',
    BadDecor: BabyCrying,
    GoodDecor: BabySleeping,
    Floater: FloatingZ,
  },
];

const THEME_DATA = THEMES.map((theme) => ({
  flatMse: mseAgainstTrue(FLAT_YS, theme.trueFn),
  dataPoints: DATA_TS.map((t, i) => ({
    x: t,
    y: clamp01(theme.trueFn(t) + DATA_NOISE[i]),
  })),
}));

const DECOR_SLOTS = [
  { size: 30, hue: -8, delay: 0 },
  { size: 42, hue: 4, delay: 0.3 },
  { size: 36, hue: -4, delay: 0.15 },
  { size: 42, hue: 6, delay: 0.45 },
  { size: 32, hue: -6, delay: 0.6 },
];

const FLOAT_SLOTS = [
  { top: '18%', duration: 13, delay: -2 },
  { top: '30%', duration: 17, delay: -8 },
  { top: '10%', duration: 15, delay: -5 },
];

function Mascot({ goodness }: { goodness: number }) {
  const mouthPath =
    goodness > 0.7
      ? 'M14 29Q22 38 30 29'
      : goodness < 0.35
        ? 'M14 34Q22 26 30 34'
        : 'M14 32 H30';

  return (
    <svg width="56" height="56" viewBox="0 0 44 44">
      <circle cx="22" cy="22" r="20" fill="#F7F4EE" stroke="#1B1B18" strokeWidth="2.5" />
      <circle cx="15" cy="19" r="2.4" fill="#1B1B18" />
      <circle cx="29" cy="19" r="2.4" fill="#1B1B18" />
      {goodness < 0.35 && (
        <>
          <path d="M11 13 L18 16" stroke="#1B1B18" strokeWidth="2" strokeLinecap="round" />
          <path d="M33 13 L26 16" stroke="#1B1B18" strokeWidth="2" strokeLinecap="round" />
          <path d="M32 9 q3 2 1 6" stroke="#4aa8d8" strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      )}
      <path d={mouthPath} stroke="#1B1B18" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {goodness > 0.7 && (
        <>
          <circle cx="10" cy="25" r="2.5" fill="#e8a5a5" opacity="0.7" />
          <circle cx="34" cy="25" r="2.5" fill="#e8a5a5" opacity="0.7" />
        </>
      )}
    </svg>
  );
}

export default function FitGame() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [themeIndex, setThemeIndex] = useState(0);
  const [controlYs, setControlYs] = useState<number[]>(() => CONTROL_XS.map(() => 0.5));
  const [dragging, setDragging] = useState<number | null>(null);

  const theme = THEMES[themeIndex];
  const { flatMse, dataPoints } = THEME_DATA[themeIndex];

  const mse = useMemo(() => mseAgainstTrue(controlYs, theme.trueFn), [controlYs, theme]);
  const goodness = clamp01(1 - mse / flatMse);
  const errorPercent = Math.round(clamp01(mse / flatMse) * 100);

  const prevErrorRef = useRef(errorPercent);
  const [trend, setTrend] = useState<'up' | 'down' | null>(null);
  useEffect(() => {
    if (errorPercent > prevErrorRef.current) setTrend('up');
    else if (errorPercent < prevErrorRef.current) setTrend('down');
    prevErrorRef.current = errorPercent;
  }, [errorPercent]);

  const errorColor = lerpColor(BAD_COLOR, GOOD_COLOR, goodness);
  const hint =
    goodness > 0.7
      ? 'Peace restored — that error is nice and low.'
      : goodness < 0.35
        ? "Way off — the error's still high."
        : 'Getting closer — keep adjusting.';

  const curvePath = useMemo(
    () =>
      SAMPLE_XS.map((s, i) => {
        const cmd = i === 0 ? 'M' : 'L';
        return `${cmd} ${pixelX(s).toFixed(1)} ${pixelY(sampleCurve(controlYs, s)).toFixed(1)}`;
      }).join(' '),
    [controlYs],
  );

  const updateFromPointer = (index: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const relY = (clientY - rect.top) / rect.height;
    const vbY = relY * VB_H;
    const yFrac = clamp01(1 - (vbY - PAD_Y) / plotH);
    setControlYs((prev) => prev.map((v, i) => (i === index ? yFrac : v)));
  };

  const handleReset = () => setControlYs(CONTROL_XS.map(() => 0.5));
  const handleChangeGraph = () => {
    setThemeIndex((i) => (i + 1) % THEMES.length);
    setControlYs(CONTROL_XS.map(() => 0.5));
    setDragging(null);
    setTrend(null);
  };

  const floatOpacity = clamp01((goodness - 0.5) * 2);
  const BadDecor = theme.BadDecor;
  const GoodDecor = theme.GoodDecor;
  const Floater = theme.Floater;

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-[28px] sm:rounded-[36px]"
      style={{ boxShadow: '0 16px 34px rgba(27,27,24,0.18)' }}
    >
      <div
        className="absolute inset-0"
        style={{ background: theme.badGradient, opacity: 1 - goodness, transition: 'opacity 400ms ease, background 500ms ease' }}
      />
      <div
        className="absolute inset-0"
        style={{ background: theme.goodGradient, opacity: goodness, transition: 'opacity 400ms ease, background 500ms ease' }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-2/3 overflow-hidden">
        {FLOAT_SLOTS.map((f, i) => (
          <Floater key={i} top={f.top} duration={f.duration} delay={f.delay} opacity={floatOpacity} />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between px-4 pb-1 sm:px-10">
        {DECOR_SLOTS.map((slot, i) => (
          <div key={i} className="relative" style={{ width: slot.size, height: slot.size * 1.4 }}>
            <div className="absolute inset-0" style={{ opacity: goodness, transition: 'opacity 400ms ease' }}>
              <GoodDecor size={slot.size} hue={slot.hue} style={{ animationDelay: `${slot.delay}s` }} />
            </div>
            <div className="absolute inset-0" style={{ opacity: 1 - goodness, transition: 'opacity 400ms ease' }}>
              <BadDecor size={slot.size} hue={slot.hue} style={{ animationDelay: `${slot.delay}s` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute right-4 top-4 sm:right-8 sm:top-6">
        <Mascot goodness={goodness} />
      </div>

      <div className="absolute left-4 top-4 max-w-[240px] rounded-2xl bg-[#F7F4EE]/90 px-4 py-3 shadow-sm backdrop-blur-sm sm:left-8 sm:top-6">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] font-medium uppercase tracking-wider text-[#4A4740] sm:text-xs">Error</span>
          <span
            className="flex items-center gap-1 text-lg font-black tabular-nums sm:text-xl"
            style={{ color: errorColor, transition: 'color 300ms ease' }}
          >
            {trend === 'up' && <TrendingUp size={16} />}
            {trend === 'down' && <TrendingDown size={16} />}
            {errorPercent}
          </span>
        </div>
        <p className="mt-1 text-xs font-light leading-snug text-[#4A4740]">{hint}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-full border border-[#1B1B18]/25 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest text-[#1B1B18] transition-colors duration-200 hover:border-[#12483d] hover:text-[#12483d]"
          >
            <RotateCcw size={12} />
            Reset
          </button>
          <button
            onClick={handleChangeGraph}
            className="flex items-center gap-1.5 rounded-full border border-[#1B1B18]/25 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest text-[#1B1B18] transition-colors duration-200 hover:border-[#12483d] hover:text-[#12483d]"
          >
            <Shuffle size={12} />
            Change Graph
          </button>
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="none"
        className="relative z-10 h-full w-full touch-none select-none"
      >
        {[0.25, 0.5, 0.75].map((g) => (
          <line
            key={g}
            x1={PAD_X}
            x2={VB_W - PAD_X}
            y1={pixelY(g)}
            y2={pixelY(g)}
            stroke="rgba(27,27,24,0.12)"
            strokeDasharray="4 6"
          />
        ))}

        {dataPoints.map((p, i) => (
          <circle key={i} cx={pixelX(p.x)} cy={pixelY(p.y)} r={6} fill="#1B1B18" stroke="#F7F4EE" strokeWidth={2} />
        ))}

        <path d={curvePath} fill="none" stroke="#1B1B18" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />

        {controlYs.map((cy, i) => (
          <g key={i}>
            <circle
              cx={pixelX(CONTROL_XS[i])}
              cy={pixelY(cy)}
              r={22}
              fill="transparent"
              style={{ cursor: 'grab', touchAction: 'none' }}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                setDragging(i);
                updateFromPointer(i, e.clientY);
              }}
              onPointerMove={(e) => {
                if (dragging === i) updateFromPointer(i, e.clientY);
              }}
              onPointerUp={() => setDragging(null)}
              onPointerCancel={() => setDragging(null)}
            />
            <circle
              cx={pixelX(CONTROL_XS[i])}
              cy={pixelY(cy)}
              r={dragging === i ? 12 : 9}
              fill="#F7F4EE"
              stroke="#12483d"
              strokeWidth={4}
              pointerEvents="none"
              style={{ transition: 'r 150ms ease' }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

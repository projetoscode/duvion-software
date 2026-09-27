import { useId, type ReactNode } from 'react';
import type { ProjectArtVariant } from '@/lib/site';
import { svgId } from '@/lib/utils';

interface Props {
  variant: ProjectArtVariant;
  hue: [string, string];
  label: string;
  className?: string;
}

/**
 * Vector project thumbnails (browser, phone, dashboard…) generated in code,
 * so the showcase is sharp at any size and weighs almost nothing.
 */
export default function ProjectArt({ variant, hue, label, className }: Props) {
  const id = svgId(useId());
  const a = `url(#${id}-a)`;
  const soft = `url(#${id}-soft)`;

  const scenes: Record<ProjectArtVariant, ReactNode> = {
    site: (
      <>
        <rect x="24" y="22" width="352" height="206" rx="12" fill="#0a0f2a" fillOpacity="0.75" stroke="#fff" strokeOpacity="0.1" />
        <circle cx="40" cy="36" r="3" fill="#fff" fillOpacity="0.3" />
        <circle cx="50" cy="36" r="3" fill="#fff" fillOpacity="0.2" />
        <circle cx="60" cy="36" r="3" fill="#fff" fillOpacity="0.15" />
        <rect x="44" y="58" width="36" height="6" rx="3" fill="#fff" fillOpacity="0.7" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={200 + i * 34} y="59" width="24" height="4" rx="2" fill="#fff" fillOpacity="0.25" />
        ))}
        <rect x="44" y="96" width="140" height="12" rx="4" fill="#fff" fillOpacity="0.9" />
        <rect x="44" y="114" width="110" height="12" rx="4" fill={a} />
        <rect x="44" y="138" width="130" height="5" rx="2.5" fill="#fff" fillOpacity="0.3" />
        <rect x="44" y="148" width="100" height="5" rx="2.5" fill="#fff" fillOpacity="0.2" />
        <rect x="44" y="170" width="74" height="20" rx="10" fill={a} />
        <g transform="translate(282 132)">
          <polygon points="0,-58 50,-29 50,29 0,58 -50,29 -50,-29" fill={soft} stroke={hue[0]} strokeOpacity="0.8" />
          <polygon points="0,-58 50,-29 0,0 -50,-29" fill="#fff" fillOpacity="0.12" />
          <polygon points="0,0 50,-29 50,29 0,58" fill={hue[1]} fillOpacity="0.35" />
          <line x1="0" y1="0" x2="0" y2="58" stroke="#fff" strokeOpacity="0.4" />
        </g>
      </>
    ),
    landing: (
      <>
        <circle cx="270" cy="125" r="78" fill={soft} />
        <circle cx="270" cy="125" r="62" fill="#0b0820" stroke={a} strokeWidth="2" />
        <path d="M222 118c14-30 82-34 98 2" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" fill="none" />
        <ellipse cx="270" cy="125" rx="120" ry="24" fill="none" stroke={hue[0]} strokeOpacity="0.6" transform="rotate(-14 270 125)" />
        <circle cx="250" cy="105" r="14" fill="#fff" fillOpacity="0.18" />
        <rect x="34" y="70" width="64" height="5" rx="2.5" fill={hue[0]} />
        <rect x="34" y="86" width="118" height="12" rx="4" fill="#fff" fillOpacity="0.9" />
        <rect x="34" y="104" width="92" height="12" rx="4" fill="#fff" fillOpacity="0.9" />
        <rect x="34" y="128" width="112" height="5" rx="2.5" fill="#fff" fillOpacity="0.3" />
        <rect x="34" y="138" width="90" height="5" rx="2.5" fill="#fff" fillOpacity="0.2" />
        <rect x="34" y="160" width="68" height="20" rx="10" fill={a} />
      </>
    ),
    app: (
      <>
        <path d="M0 190 C80 150 140 220 220 170 S340 120 400 150 V250 H0Z" fill={soft} />
        <g transform="rotate(-10 150 125)">
          <rect x="104" y="36" width="96" height="184" rx="18" fill="#0a0d24" stroke={a} strokeWidth="2" />
          <rect x="114" y="60" width="76" height="44" rx="10" fill={a} fillOpacity="0.85" />
          <rect x="114" y="112" width="76" height="22" rx="7" fill="#fff" fillOpacity="0.12" />
          <rect x="114" y="140" width="76" height="22" rx="7" fill="#fff" fillOpacity="0.12" />
          <rect x="114" y="168" width="48" height="22" rx="7" fill="#fff" fillOpacity="0.12" />
        </g>
        <g transform="rotate(8 262 130)">
          <rect x="216" y="44" width="92" height="176" rx="18" fill="#0a0d24" stroke="#fff" strokeOpacity="0.2" />
          <circle cx="262" cy="104" r="28" fill="none" stroke={a} strokeWidth="6" strokeDasharray="120 60" />
          <rect x="230" y="150" width="64" height="8" rx="4" fill="#fff" fillOpacity="0.6" />
          <rect x="238" y="166" width="48" height="6" rx="3" fill="#fff" fillOpacity="0.25" />
        </g>
      </>
    ),
    system: (
      <>
        <rect x="20" y="20" width="360" height="210" rx="12" fill="#0a0f2a" fillOpacity="0.8" stroke="#fff" strokeOpacity="0.1" />
        <rect x="20" y="20" width="70" height="210" rx="12" fill="#fff" fillOpacity="0.04" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x="34" y={46 + i * 22} width={i === 1 ? 42 : 34} height="6" rx="3" fill={i === 1 ? hue[0] : '#fff'} fillOpacity={i === 1 ? 1 : 0.25} />
        ))}
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={106 + i * 90} y="38" width="80" height="44" rx="8" fill="#fff" fillOpacity="0.05" stroke="#fff" strokeOpacity="0.08" />
            <rect x={116 + i * 90} y="50" width="30" height="5" rx="2.5" fill="#fff" fillOpacity="0.35" />
            <rect x={116 + i * 90} y="62" width="46" height="9" rx="3" fill={i === 0 ? a : '#fff'} fillOpacity={i === 0 ? 1 : 0.8} />
          </g>
        ))}
        <path d="M110 190 L150 160 L190 172 L230 130 L270 146 L310 110 L360 120 V214 H110Z" fill={soft} />
        <path d="M110 190 L150 160 L190 172 L230 130 L270 146 L310 110 L360 120" fill="none" stroke={a} strokeWidth="2.5" />
        {[150, 230, 310].map((x, i) => (
          <circle key={x} cx={x} cy={[160, 130, 110][i]} r="4" fill="#fff" />
        ))}
      </>
    ),
    shop: (
      <>
        <rect x="24" y="30" width="120" height="8" rx="4" fill="#fff" fillOpacity="0.85" />
        <rect x="24" y="46" width="80" height="5" rx="2.5" fill="#fff" fillOpacity="0.3" />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${24 + i * 122} 70)`}>
            <rect width="108" height="150" rx="12" fill="#0a0d24" stroke="#fff" strokeOpacity="0.1" />
            <rect x="10" y="10" width="88" height="80" rx="8" fill={i === 1 ? a : soft} />
            <circle cx="54" cy="50" r={i === 1 ? 22 : 18} fill="#fff" fillOpacity={i === 1 ? 0.3 : 0.12} />
            <rect x="10" y="102" width="64" height="6" rx="3" fill="#fff" fillOpacity="0.7" />
            <rect x="10" y="116" width="40" height="8" rx="3" fill={hue[0]} />
            <circle cx="88" cy="128" r="10" fill={a} />
          </g>
        ))}
      </>
    ),
    ai: (
      <>
        {[
          [80, 70, 200, 125],
          [80, 125, 200, 125],
          [80, 180, 200, 125],
          [200, 125, 320, 80],
          [200, 125, 320, 170],
          [80, 70, 140, 40],
          [320, 80, 360, 130],
        ].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={a} strokeOpacity="0.6" strokeWidth="1.5" />
        ))}
        <circle cx="200" cy="125" r="46" fill={soft} />
        <circle cx="200" cy="125" r="22" fill={a} />
        <circle cx="200" cy="125" r="8" fill="#fff" />
        {[
          [80, 70],
          [80, 125],
          [80, 180],
          [320, 80],
          [320, 170],
          [140, 40],
          [360, 130],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="7" fill="#0a0d24" stroke={hue[0]} strokeWidth="2" />
        ))}
        <rect x="236" y="190" width="130" height="34" rx="12" fill="#fff" fillOpacity="0.07" stroke="#fff" strokeOpacity="0.15" />
        <rect x="248" y="201" width="80" height="5" rx="2.5" fill="#fff" fillOpacity="0.6" />
        <rect x="248" y="211" width="56" height="5" rx="2.5" fill="#fff" fillOpacity="0.3" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 400 250" role="img" aria-label={label} className={className} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#070a1f" />
          <stop offset="1" stopColor="#0d0726" />
        </linearGradient>
        <linearGradient id={`${id}-a`} x1="0" y1="0" x2="400" y2="250" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={hue[0]} />
          <stop offset="1" stopColor={hue[1]} />
        </linearGradient>
        <linearGradient id={`${id}-soft`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={hue[0]} stopOpacity="0.35" />
          <stop offset="1" stopColor={hue[1]} stopOpacity="0.15" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.72" cy="0.38" r="0.65">
          <stop offset="0" stopColor={hue[1]} stopOpacity="0.5" />
          <stop offset="1" stopColor={hue[1]} stopOpacity="0" />
        </radialGradient>
        <pattern id={`${id}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="#fff" strokeOpacity="0.04" />
        </pattern>
      </defs>
      <rect width="400" height="250" fill={`url(#${id}-bg)`} />
      <rect width="400" height="250" fill={`url(#${id}-grid)`} />
      <rect width="400" height="250" fill={`url(#${id}-glow)`} />
      {scenes[variant]}
    </svg>
  );
}

/**
 * Circuit-trace definitions for the atmosphere background.
 *
 * Three trace variants (A/B/C) declared once and stacked down the page by
 * <Atmosphere/> via <use href>, so the whole background costs one copy of the
 * geometry regardless of document height. Transcoded verbatim from the
 * prototype's hidden <svg><defs> block.
 */
export function CircuitDefs() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <defs>
      <linearGradient id="ndiTube" x1="0" y1="0" x2="0.9" y2="1"><stop stopColor="#ffffff" /><stop offset="0.3" stopColor="#b9ffe0" /><stop offset="0.62" stopColor="#5ac994" /><stop offset="1" stopColor="#1d7d5c" /></linearGradient>
      <filter id="ndiTubeSoft" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="1.1" /></filter>
      <filter id="cglow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3.2" /></filter>
      <g id="ndiTA">
        <g stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M0,120 H160 L200,160 H360 V90" /><path d="M0,300 H90 V220 H240 L280,180 H430" />
          <path d="M0,480 H140 L180,440 H320 V520 H460" /><path d="M0,660 H100 V600 H260 L300,640 H440" />
          <path d="M0,820 H180 V760 H300 L340,800 H520" /><path d="M120,0 V90 H260" />
          <path d="M520,0 V140 H660 V320 L700,360 H860" /><path d="M430,180 V300 H560 V420" />
          <path d="M460,520 H620 V640 H780 L820,600 H960" /><path d="M520,820 H700 V700 H840" />
          <path d="M840,0 V120 L880,160 V300 H1020" /><path d="M960,600 V740 H1100 V860" />
          <path d="M1440,180 H1280 L1240,220 H1080 V360" /><path d="M1440,400 H1300 V500 H1140 L1100,540 H980" />
          <path d="M1440,620 H1320 L1280,660 H1140" /><path d="M1440,800 H1280 V720 H1120" />
          <path d="M1120,360 V480 H1240" /><path d="M700,360 V500 H620" /><path d="M1020,300 H1160 V180" />
        </g>
        <g fill="#0c111b" stroke="currentColor" strokeWidth="1.6">
          <circle cx="360" cy="160" r="7" /><circle cx="430" cy="300" r="7" /><circle cx="560" cy="420" r="7" />
          <circle cx="620" cy="640" r="7" /><circle cx="860" cy="360" r="7" /><circle cx="1080" cy="360" r="7" />
          <circle cx="1140" cy="620" r="7" /><circle cx="260" cy="600" r="7" /><circle cx="700" cy="700" r="7" />
          <circle cx="1020" cy="300" r="7" /><circle cx="1240" cy="220" r="7" /><circle cx="1300" cy="500" r="7" />
        </g>
        <g fill="currentColor">
          <circle cx="200" cy="160" r="3.6" /><circle cx="280" cy="180" r="3.6" /><circle cx="180" cy="440" r="3.6" />
          <circle cx="300" cy="640" r="3.6" /><circle cx="820" cy="600" r="3.6" /><circle cx="1100" cy="540" r="3.6" />
          <circle cx="1280" cy="660" r="3.6" /><circle cx="880" cy="160" r="3.6" /><circle cx="1100" cy="860" r="3.6" />
          <rect x="116" y="86" width="8" height="8" /><rect x="636" y="316" width="8" height="8" /><rect x="1236" y="476" width="8" height="8" />
        </g>
      </g>
      <g id="ndiTB">
        <g stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M0,220 H120 L180,160 H340 L400,220 H520" /><path d="M0,440 H200 L260,500 H420" />
          <path d="M0,640 H160 L220,580 H380 V440" /><path d="M0,80 H80 V180" />
          <path d="M260,0 V80 L320,140 V280 H460" /><path d="M520,220 V380 L580,440 H760" />
          <path d="M420,500 V680 H600 L660,740 H820" /><path d="M380,900 V760 H540" />
          <path d="M760,0 V120 H900 V260 L960,320 H1120" /><path d="M760,440 V620 H920 V800" />
          <path d="M1120,320 V480 L1180,540 H1360" /><path d="M900,900 V740 H1060 L1120,680 H1280" />
          <path d="M1440,120 H1300 L1240,180 H1100" /><path d="M1440,340 H1320 V240" />
          <path d="M1440,560 H1280 L1220,620 H1060" /><path d="M1440,760 H1300 V860" />
          <path d="M580,440 V600" /><path d="M960,320 V460 H1120" /><path d="M320,280 H460 V420" />
        </g>
        <g fill="#0c111b" stroke="currentColor" strokeWidth="1.6">
          <circle cx="340" cy="160" r="7" /><circle cx="520" cy="220" r="7" /><circle cx="460" cy="280" r="7" />
          <circle cx="580" cy="440" r="7" /><circle cx="600" cy="680" r="7" /><circle cx="900" cy="260" r="7" />
          <circle cx="1120" cy="320" r="7" /><circle cx="1180" cy="540" r="7" /><circle cx="920" cy="620" r="7" />
          <circle cx="1240" cy="180" r="7" /><circle cx="220" cy="580" r="7" /><circle cx="1060" cy="740" r="7" />
        </g>
        <g fill="currentColor">
          <circle cx="180" cy="160" r="3.6" /><circle cx="400" cy="220" r="3.6" /><circle cx="260" cy="500" r="3.6" />
          <circle cx="660" cy="740" r="3.6" /><circle cx="960" cy="320" r="3.6" /><circle cx="1220" cy="620" r="3.6" />
          <circle cx="1120" cy="680" r="3.6" /><circle cx="320" cy="140" r="3.6" /><circle cx="1320" cy="240" r="3.6" />
          <rect x="76" y="176" width="8" height="8" /><rect x="456" y="416" width="8" height="8" /><rect x="916" y="796" width="8" height="8" />
        </g>
      </g>
      <g id="ndiTC">
        <g stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M0,160 H100 V260 H240 L300,320 H460 V200" /><path d="M0,360 H180 L240,300 H400" />
          <path d="M0,560 H120 V680 H280 L340,620 H500" /><path d="M0,760 H200 L260,820 H420" />
          <path d="M160,0 V80 H320 L380,140 V300" /><path d="M460,200 H620 L680,140 V0" />
          <path d="M460,320 V480 H640 V620 H800" /><path d="M500,620 V780 H680 V900" />
          <path d="M840,0 V140 H980 L1040,200 H1200" /><path d="M800,480 H960 V340 H1100" />
          <path d="M1040,620 H1220 V760 H1400" /><path d="M680,900 V760 H860 L920,700 H1080" />
          <path d="M1440,240 H1300 V380 H1160 L1100,440 V560" /><path d="M1440,460 H1360 V560" />
          <path d="M1440,680 H1300 L1240,620 H1100" /><path d="M1440,860 H1320 V760" />
          <path d="M640,480 V340 H760" /><path d="M1200,200 V340" /><path d="M320,80 V200 H440" />
        </g>
        <g fill="#0c111b" stroke="currentColor" strokeWidth="1.6">
          <circle cx="460" cy="320" r="7" /><circle cx="400" cy="300" r="7" /><circle cx="640" cy="480" r="7" />
          <circle cx="640" cy="620" r="7" /><circle cx="980" cy="140" r="7" /><circle cx="1200" cy="200" r="7" />
          <circle cx="960" cy="480" r="7" /><circle cx="1220" cy="620" r="7" /><circle cx="1100" cy="440" r="7" />
          <circle cx="320" cy="260" r="7" /><circle cx="280" cy="680" r="7" /><circle cx="860" cy="760" r="7" />
        </g>
        <g fill="currentColor">
          <circle cx="300" cy="320" r="3.6" /><circle cx="240" cy="300" r="3.6" /><circle cx="340" cy="620" r="3.6" />
          <circle cx="260" cy="820" r="3.6" /><circle cx="1040" cy="200" r="3.6" /><circle cx="1240" cy="620" r="3.6" />
          <circle cx="920" cy="700" r="3.6" /><circle cx="680" cy="140" r="3.6" /><circle cx="1100" cy="560" r="3.6" />
          <rect x="156" y="76" width="8" height="8" /><rect x="636" y="616" width="8" height="8" /><rect x="1196" y="196" width="8" height="8" />
        </g>
      </g>
      </defs>
    </svg>
  );
}

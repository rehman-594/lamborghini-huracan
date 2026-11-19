export interface PaintFinish {
  id: string;
  name: string;
  italianName: string;
  hex: string;
  metalness: number;
  roughness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  caliperHex: string;
}

export type SceneSideSlot =
  | 'top-left'
  | 'mid-left'
  | 'bottom-left'
  | 'top-right'
  | 'mid-right'
  | 'bottom-right';

export interface SceneSpecItem {
  label: string;
  value: string;
}

export interface ScrollScene {
  id: string;
  index: number;
  label: string;
  title: string;
  subtitle: string;
  progressStart: number;
  progressPeak: number;
  progressEnd: number;
  titleSlot: SceneSideSlot;
  specsSlot: SceneSideSlot;
  specs: SceneSpecItem[];
  align: 'center' | 'left' | 'right' | 'bottom';
  cameraPos: [number, number, number];
  targetPos: [number, number, number];
}

export interface CarHotspot {
  id: string;
  title: string;
  category: string;
  metric: string;
  description: string;
  position: [number, number, number];
  cameraPos: [number, number, number];
  targetPos: [number, number, number];
}

export interface EngineeringFeature {
  id: string;
  number: string;
  title: string;
  kicker: string;
  metric: string;
  summary: string;
  details: string[];
  image?: string;
  imageAlt?: string;
  cameraSceneIndex: number;
}

export interface SpecCounter {
  id: string;
  value: number;
  decimals?: number;
  suffix: string;
  label: string;
  detail: string;
}

export interface SpecRow {
  category: string;
  label: string;
  value: string;
}

export interface CockpitHighlight {
  id: string;
  title: string;
  material: string;
  description: string;
  detailMetric: string;
}

export const PAINT_FINISHES: PaintFinish[] = [
  {
    id: 'grigio-titans',
    name: 'Grigio Titans Matte',
    italianName: 'Grigio Titans',
    hex: '#3b3e45',
    metalness: 0.78,
    roughness: 0.36,
    clearcoat: 0.35,
    clearcoatRoughness: 0.38,
    caliperHex: '#c9a25e',
  },
  {
    id: 'nero-noctis',
    name: 'Nero Noctis Gloss',
    italianName: 'Nero Noctis',
    hex: '#111216',
    metalness: 0.85,
    roughness: 0.14,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    caliperHex: '#d9381e',
  },
  {
    id: 'bianco-icarus',
    name: 'Bianco Icarus Metallic',
    italianName: 'Bianco Icarus',
    hex: '#dde0e6',
    metalness: 0.55,
    roughness: 0.16,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    caliperHex: '#c9a25e',
  },
  {
    id: 'giallo-inti',
    name: 'Giallo Inti Pearl',
    italianName: 'Giallo Inti',
    hex: '#e0a81c',
    metalness: 0.72,
    roughness: 0.18,
    clearcoat: 1.0,
    clearcoatRoughness: 0.07,
    caliperHex: '#18181b',
  },
  {
    id: 'verde-selvans',
    name: 'Verde Selvans',
    italianName: 'Verde Selvans',
    hex: '#4e8a27',
    metalness: 0.75,
    roughness: 0.16,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    caliperHex: '#c9a25e',
  },
  {
    id: 'arancio-xanto',
    name: 'Arancio Xanto',
    italianName: 'Arancio Xanto',
    hex: '#d94814',
    metalness: 0.74,
    roughness: 0.17,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    caliperHex: '#18181b',
  },
];

export const SCROLL_SCENES: ScrollScene[] = [
  {
    id: 'scene-0',
    index: 0,
    label: '01 · Introduction',
    title: 'Huracán Tecnica',
    subtitle: 'Naturally aspirated 5.2-liter V10 architecture. Sculpted by Sant’Agata aerodynamics.',
    progressStart: -0.05,
    progressPeak: 0.03,
    progressEnd: 0.125,
    titleSlot: 'top-right',
    specsSlot: 'bottom-left',
    specs: [
      { label: 'Power', value: '640 CV @ 8,000 rpm' },
      { label: '0–100 km/h', value: '3.2 s' },
      { label: 'Top Speed', value: '325 km/h' },
    ],
    align: 'right',
    cameraPos: [0, 0, 0],
    targetPos: [0, 0, 0],
  },
  {
    id: 'scene-1',
    index: 1,
    label: '02 · Forged Wheel & CCB',
    title: 'Carbon-Ceramic Precision',
    subtitle: '20-inch Damiso forged alloy wheels housing cross-drilled rotors and monobloc calipers.',
    progressStart: 0.125,
    progressPeak: 0.23,
    progressEnd: 0.34,
    titleSlot: 'top-right',
    specsSlot: 'bottom-left',
    specs: [
      { label: 'Front Rotor', value: '380 mm Carbon-Ceramic' },
      { label: 'Calipers', value: '6-Piston Monobloc' },
      { label: '100–0 km/h', value: '31.5 m' },
    ],
    align: 'right',
    cameraPos: [0, 0, 0],
    targetPos: [0, 0, 0],
  },
  {
    id: 'scene-2',
    index: 2,
    label: '03 · Side Profile',
    title: 'Pure Wedge Silhouette',
    subtitle: 'Sculpted lateral air intakes feed cool air straight into the mid-rear ten-cylinder plenums.',
    progressStart: 0.34,
    progressPeak: 0.42,
    progressEnd: 0.50,
    titleSlot: 'bottom-left',
    specsSlot: 'bottom-right',
    specs: [
      { label: 'Overall Height', value: '1,165 mm' },
      { label: 'Overall Length', value: '4,567 mm' },
      { label: 'Dry Weight', value: '1,379 kg' },
    ],
    align: 'left',
    cameraPos: [0, 0, 0],
    targetPos: [0, 0, 0],
  },
  {
    id: 'scene-3',
    index: 3,
    label: '04 · Rear Three-Quarter',
    title: 'Balanced Downforce',
    subtitle: 'Fixed rear wing calibrated to deliver higher rear downforce without sacrificing drag efficiency.',
    progressStart: 0.50,
    progressPeak: 0.585,
    progressEnd: 0.67,
    titleSlot: 'top-right',
    specsSlot: 'bottom-left',
    specs: [
      { label: 'Rear Downforce', value: '+35% vs EVO RWD' },
      { label: 'Aero Drag', value: '-20% Reduction' },
      { label: 'Drivetrain', value: 'RWD + Rear Steering' },
    ],
    align: 'right',
    cameraPos: [0, 0, 0],
    targetPos: [0, 0, 0],
  },
  {
    id: 'scene-4',
    index: 4,
    label: '05 · Rear Architecture',
    title: 'Hexagonal Signature',
    subtitle: 'High-mounted hexagonal acoustic outlets exit directly above a four-strake carbon diffuser.',
    progressStart: 0.67,
    progressPeak: 0.72,
    progressEnd: 0.77,
    titleSlot: 'mid-left',
    specsSlot: 'mid-right',
    specs: [
      { label: 'Exhaust', value: 'Dual Hexagonal Outlets' },
      { label: 'Diffuser', value: '4-Strake Carbon' },
      { label: 'Max Torque', value: '565 Nm @ 6,500 rpm' },
    ],
    align: 'left',
    cameraPos: [0, 0, 0],
    targetPos: [0, 0, 0],
  },
  {
    id: 'scene-5',
    index: 5,
    label: '06 · Structural Core',
    title: 'Hybrid Spaceframe',
    subtitle: 'Aluminum and carbon-fiber monocoque engineered for centralized mid-rear inertia.',
    progressStart: 0.77,
    progressPeak: 0.815,
    progressEnd: 0.86,
    titleSlot: 'top-left',
    specsSlot: 'bottom-right',
    specs: [
      { label: 'Weight Split', value: '41 / 59 Front / Rear' },
      { label: 'Power-to-Weight', value: '2.15 kg / CV' },
      { label: 'Gearbox', value: '7-Speed LDF Dual-Clutch' },
    ],
    align: 'left',
    cameraPos: [0, 0, 0],
    targetPos: [0, 0, 0],
  },
  {
    id: 'scene-6',
    index: 6,
    label: '07 · Driver Cockpit',
    title: 'Built Around the Apex',
    subtitle: 'Carbon-shell Alcantara seats, 12.3-inch telemetry cluster, and anodized toggle console.',
    progressStart: 0.86,
    progressPeak: 0.94,
    progressEnd: 1.05,
    titleSlot: 'bottom-right',
    specsSlot: 'bottom-left',
    specs: [
      { label: 'Drive Modes', value: 'Strada · Sport · Corsa' },
      { label: 'Display', value: '12.3" Digital TFT' },
      { label: 'Trim', value: 'Alcantara & Carbon' },
    ],
    align: 'right',
    cameraPos: [0, 0, 0],
    targetPos: [0, 0, 0],
  },
];

export const SCENE_TELEMETRY: string[] = [
  '640 CV · 5,204 cm³ V10',
  '380 mm Carbon-Ceramic · 20" Damiso Forged',
  '1,165 mm Height · Lateral V10 Intakes',
  '+35% Rear Downforce · Fixed Aero Wing',
  'Hexagonal Exhausts · 4-Strake Diffuser',
  '1,379 kg Dry · 41 / 59 Weight Split',
  'Strada · Sport · Corsa Cockpit HMI',
];

export const CAR_HOTSPOTS: CarHotspot[] = [];

export const ENGINEERING_FEATURES: EngineeringFeature[] = [
  {
    id: 'aerodynamics',
    number: '01',
    title: 'Aerodynamic Body Design',
    kicker: 'Wind-Tunnel Sculpted',
    metric: '+35% Downforce · -20% Drag',
    summary:
      'Every crease across the hybrid aluminum and carbon-fiber body channels air cleanly over the canopy and onto the fixed rear wing without bulky active flaps.',
    details: [
      'Front bumper air curtains reduce wheel-well turbulence',
      'Underbody aero deflectors accelerate diffuser extraction',
      'Fixed rear wing calibrated with Tecnica rear decklid',
    ],
    image: '/src/assets/images/huracan_aero_windtunnel_1794998143712.jpg',
    imageAlt: 'Lamborghini Huracán Tecnica Matte Charcoal Studio Side Three-Quarter View',
    cameraSceneIndex: 0,
  },
  {
    id: 'headlights',
    number: '02',
    title: 'Ypsilon LED Headlights',
    kicker: 'Optical Precision',
    metric: 'Full LED Matrix',
    summary:
      'Signature twin-Ypsilon daytime running lights sit recessed into sharp hexagonal housings, cutting cleanly through night stages with adaptive beam geometry.',
    details: [
      'Instantaneous solid-state LED matrix illumination',
      'Recessed aerodynamic bezels flush with the front fender',
      'Rear Y-pattern LED taillights mirror the front stance',
    ],
    cameraSceneIndex: 0,
  },
  {
    id: 'side-profile',
    number: '03',
    title: 'Sculpted Side Profile',
    kicker: 'Silhouette & Intakes',
    metric: '1,165 mm Roofline',
    summary:
      'Inspired by the Essenza SCV12, the darkened window contour elongates the cabin while deep hexagonal side intakes force cool air straight into the V10 plenums.',
    details: [
      'Flush aerodynamic door handles sit seamlessly in the flank',
      'Carbon-fiber side skirts stabilize lateral underbody pressure',
      'Rear-wheel steering adjusts up to 3° for razor agility',
    ],
    cameraSceneIndex: 2,
  },
  {
    id: 'engine-placement',
    number: '04',
    title: 'Mid-Rear V10 Placement',
    kicker: 'Centralized Mass',
    metric: '41 / 59 Weight Distribution',
    summary:
      'Mounted longitudinally just millimeters behind the driver bulkhead, the 5.2-liter naturally aspirated V10 keeps polar inertia concentrated at the car’s center of gravity.',
    details: [
      'Dry-sump lubrication lowers engine mounting height',
      '90-degree V10 block with dual MPI + DSI fuel injection',
      'Forged carbon-fiber structural brace over bronze valve covers',
    ],
    image: '/src/assets/images/huracan_engine_v10_1794998143845.jpg',
    imageAlt: 'Lamborghini Huracán 5.2L Naturally Aspirated V10 Engine Bay',
    cameraSceneIndex: 3,
  },
  {
    id: 'exhaust',
    number: '05',
    title: 'Hexagonal Exhaust Design',
    kicker: 'Acoustic Engineering',
    metric: 'Dual Hexagonal Outlets',
    summary:
      'Re-engineered specifically for the Tecnica, the dual hexagonal tailpipes sharpen high-RPM V10 harmonics above 5,000 rpm while reducing backpressure.',
    details: [
      'Active exhaust valves open in Sport and Corsa modes',
      'High-mounted position clears the four-strake rear diffuser',
      'Heat-resistant matte black ceramic-coated outlet bezels',
    ],
    cameraSceneIndex: 4,
  },
  {
    id: 'wheels',
    number: '06',
    title: 'Forged Wheels & CCB',
    kicker: 'Unsprung Mass Reduction',
    metric: '380 mm Front · 356 mm Rear',
    summary:
      '20-inch Damiso diamond-cut forged rims shave unsprung rotational inertia while exposing massive cross-drilled Carbon-Ceramic Brake discs.',
    details: [
      'Front 245/30 R20 · Rear 305/30 R20 high-grip rubber',
      '6-piston front and 4-piston rear aluminum monobloc calipers',
      'Dedicated brake cooling ducts integrated into lower wishbones',
    ],
    image: '/src/assets/images/huracan_wheel_ccb_1794998145072.jpg',
    imageAlt: 'Lamborghini Huracán Forged Y-Spoke Wheel and Carbon-Ceramic Brake System',
    cameraSceneIndex: 1,
  },
  {
    id: 'cockpit',
    number: '07',
    title: 'Fighter-Jet Interior Cockpit',
    kicker: 'Human-Machine Interface',
    metric: 'LDVI Telemetry Core',
    summary:
      'Low seating geometry, Alcantara surfaces, and an angled center console put telemetry, ANIMA drive modes, and the red flip-cover ignition at the driver’s fingertips.',
    details: [
      'Dedicated HMI graphics for Strada, Sport, and Corsa',
      'Lightweight carbon-shell sport seats with laser-etched Alcantara',
      'Direct-mount aluminum shift paddles behind hexagonal wheel',
    ],
    cameraSceneIndex: 6,
  },
];

export const HURACAN_VARIANT = {
  fullName: 'Lamborghini Huracán Tecnica',
  chassisCode: 'LB724 · Sant’Agata Bolognese',
  tagline: 'The bridge between road grand touring and pure track telemetry.',
};

export const SPEC_COUNTERS: SpecCounter[] = [
  {
    id: 'power',
    value: 640,
    suffix: ' CV',
    label: 'Maximum Power',
    detail: '470 kW / 631 hp at 8,000 rpm',
  },
  {
    id: 'torque',
    value: 565,
    suffix: ' Nm',
    label: 'Maximum Torque',
    detail: '417 lb-ft at 6,500 rpm',
  },
  {
    id: 'accel',
    value: 3.2,
    decimals: 1,
    suffix: ' s',
    label: '0–100 km/h',
    detail: '9.1 s to 200 km/h',
  },
  {
    id: 'top-speed',
    value: 325,
    suffix: ' km/h',
    label: 'Top Speed',
    detail: '202 mph electronically unclipped',
  },
  {
    id: 'displacement',
    value: 5204,
    suffix: ' cm³',
    label: 'Displacement',
    detail: 'Naturally aspirated 90° V10',
  },
  {
    id: 'weight',
    value: 1379,
    suffix: ' kg',
    label: 'Dry Weight',
    detail: '2.15 kg/CV power-to-weight',
  },
];

export const VERIFIED_SPECS_TABLE: SpecRow[] = [
  { category: 'Model', label: 'Selected Variant', value: 'Lamborghini Huracán Tecnica' },
  { category: 'Engine', label: 'Engine Configuration', value: 'Naturally aspirated 10-cylinder V90°, MPI + DSI dual injection' },
  { category: 'Engine', label: 'Engine Displacement', value: '5,204 cm³ (317.57 cu in)' },
  { category: 'Output', label: 'Maximum Power', value: '640 CV (470 kW / 631 hp) @ 8,000 rpm' },
  { category: 'Output', label: 'Maximum Torque', value: '565 Nm (417 lb-ft) @ 6,500 rpm' },
  { category: 'Performance', label: '0–100 km/h Acceleration', value: '3.2 s' },
  { category: 'Performance', label: '0–200 km/h Acceleration', value: '9.1 s' },
  { category: 'Performance', label: 'Top Speed', value: '325 km/h (202 mph)' },
  { category: 'Performance', label: 'Braking (100–0 km/h)', value: '31.5 m (Carbon-Ceramic)' },
  { category: 'Drivetrain', label: 'Transmission', value: '7-speed LDF dual-clutch automatic with shift paddles' },
  { category: 'Drivetrain', label: 'Drivetrain', value: 'Rear-Wheel Drive (RWD) with LDVI & Rear-Wheel Steering' },
  { category: 'Structure', label: 'Dry Weight', value: '1,379 kg (3,040 lb) · 41/59 front/rear distribution' },
  { category: 'Structure', label: 'Chassis', value: 'Hybrid aluminum and carbon-fiber spaceframe' },
  { category: 'Dimensions', label: 'Length × Width × Height', value: '4,567 × 1,933 × 1,165 mm' },
];

export const COCKPIT_HIGHLIGHTS: CockpitHighlight[] = [
  {
    id: 'driver-cockpit',
    title: 'Driver-Focused Cockpit',
    material: 'Forged Carbon & Nero Ade Alcantara',
    description:
      'Every display plane and switch bank angles deliberately toward the driver seat, minimizing eye travel at triple-digit speeds.',
    detailMetric: 'Low-slung monocoque seating',
  },
  {
    id: 'steering-wheel',
    title: 'Hexagonal Steering Wheel',
    material: 'Alcantara Rim & Carbon Spokes',
    description:
      'Flat-bottom hexagonal profile with thumb-accessible indicator toggles, ANIMA drive-mode selector (Strada, Sport, Corsa), and fixed column paddles.',
    detailMetric: '3 ANIMA Drive Modes',
  },
  {
    id: 'digital-cluster',
    title: '12.3" Digital TFT Cluster',
    material: 'Anti-Reflective High-Contrast Panel',
    description:
      'Reconfigures dynamically with drive mode—transforming from dual grand-touring dials into a central Corsa shift-light tachometer and tire telemetry monitor.',
    detailMetric: '8,500 RPM Redline',
  },
  {
    id: 'center-console',
    title: 'Angled Console & Red Ignition',
    material: 'CNC Anodized Aluminum & Carbon',
    description:
      '8.4-inch vertical HMI touchscreen paired with aircraft-style physical toggle switches and the iconic red flip-cover engine start trigger.',
    detailMetric: '8.4" HMI + Tactile Toggles',
  },
  {
    id: 'sports-seats',
    title: 'Carbon-Shell Sport Seats',
    material: 'Hexagonal Stitch Alcantara',
    description:
      'Lightweight sculpted bolsters lock torso posture under lateral cornering loads while maintaining long-distance ergonomic comfort.',
    detailMetric: 'Carbon Composite Shell',
  },
  {
    id: 'materials',
    title: 'Ad Personam Trim Craft',
    material: 'Hand-Stitched Leather & Twill Carbon',
    description:
      'Zero glossy plastic glare surfaces. Matte Alcantara absorbs windshield reflections while hexagonal laser perforations vent cabin heat.',
    detailMetric: 'Made in Sant’Agata Bolognese',
  },
];

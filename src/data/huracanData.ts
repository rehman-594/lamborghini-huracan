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
    name: 'Titanium Gray Matte',
    italianName: 'Titanium Gray',
    hex: '#3b3e45',
    metalness: 0.78,
    roughness: 0.36,
    clearcoat: 0.35,
    clearcoatRoughness: 0.38,
    caliperHex: '#c9a25e',
  },
  {
    id: 'nero-noctis',
    name: 'Night Black Gloss',
    italianName: 'Night Black',
    hex: '#111216',
    metalness: 0.85,
    roughness: 0.14,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    caliperHex: '#d9381e',
  },
  {
    id: 'bianco-icarus',
    name: 'Icarus White Metallic',
    italianName: 'Icarus White',
    hex: '#dde0e6',
    metalness: 0.55,
    roughness: 0.16,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    caliperHex: '#c9a25e',
  },
  {
    id: 'giallo-inti',
    name: 'Inti Pearl Yellow',
    italianName: 'Pearl Yellow',
    hex: '#e0a81c',
    metalness: 0.72,
    roughness: 0.18,
    clearcoat: 1.0,
    clearcoatRoughness: 0.07,
    caliperHex: '#18181b',
  },
  {
    id: 'verde-selvans',
    name: 'Selvans Green Metallic',
    italianName: 'Selvans Green',
    hex: '#4e8a27',
    metalness: 0.75,
    roughness: 0.16,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    caliperHex: '#c9a25e',
  },
  {
    id: 'arancio-xanto',
    name: 'Xanto Pearl Orange',
    italianName: 'Pearl Orange',
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
    subtitle: 'Naturally aspirated 5.2-liter V10 architecture. Sculpted with high-performance aerodynamics.',
    progressStart: -0.05,
    progressPeak: 0.03,
    progressEnd: 0.125,
    titleSlot: 'top-right',
    specsSlot: 'bottom-left',
    specs: [
      { label: 'Power', value: '640 hp @ 8,000 rpm' },
      { label: '0–60 mph', value: '3.1 s (0–100: 3.2 s)' },
      { label: 'Top Speed', value: '202 mph (325 km/h)' },
    ],
    align: 'right',
    cameraPos: [0, 0, 0],
    targetPos: [0, 0, 0],
  },
  {
    id: 'scene-1',
    index: 1,
    label: '02 · Forged Wheels & Brakes',
    title: 'Carbon-Ceramic Precision',
    subtitle: '20-inch Damiso forged alloy wheels housing cross-drilled carbon-ceramic rotors and monoblock calipers.',
    progressStart: 0.125,
    progressPeak: 0.23,
    progressEnd: 0.34,
    titleSlot: 'top-right',
    specsSlot: 'bottom-left',
    specs: [
      { label: 'Front Rotor', value: '15.0 in (380 mm) CCB' },
      { label: 'Calipers', value: '6-Piston Monoblock' },
      { label: '62–0 mph Braking', value: '103.3 ft (31.5 m)' },
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
      { label: 'Overall Height', value: '45.9 in (1,165 mm)' },
      { label: 'Overall Length', value: '179.8 in (4,567 mm)' },
      { label: 'Dry Weight', value: '3,040 lbs (1,379 kg)' },
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
      { label: 'Drivetrain', value: 'RWD + Rear-Wheel Steering' },
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
    subtitle: 'High-mounted hexagonal exhaust outlets exit directly above a four-strake carbon-fiber diffuser.',
    progressStart: 0.67,
    progressPeak: 0.72,
    progressEnd: 0.77,
    titleSlot: 'mid-left',
    specsSlot: 'mid-right',
    specs: [
      { label: 'Exhaust', value: 'Dual Hexagonal Outlets' },
      { label: 'Diffuser', value: '4-Strake Carbon Fiber' },
      { label: 'Max Torque', value: '417 lb-ft (565 Nm)' },
    ],
    align: 'left',
    cameraPos: [0, 0, 0],
    targetPos: [0, 0, 0],
  },
  {
    id: 'scene-5',
    index: 6,
    label: '06 · Structural Core',
    title: 'Hybrid Spaceframe',
    subtitle: 'Aluminum and carbon-fiber monocoque engineered for centralized mid-rear inertia.',
    progressStart: 0.77,
    progressPeak: 0.815,
    progressEnd: 0.86,
    titleSlot: 'top-left',
    specsSlot: 'bottom-right',
    specs: [
      { label: 'Weight Split', value: '41% Front / 59% Rear' },
      { label: 'Power-to-Weight', value: '4.75 lbs / hp' },
      { label: 'Transmission', value: '7-Speed Dual-Clutch' },
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
      { label: 'Drive Modes', value: 'Street · Sport · Track' },
      { label: 'Display', value: '12.3" Digital TFT' },
      { label: 'Trim', value: 'Alcantara & Carbon Fiber' },
    ],
    align: 'right',
    cameraPos: [0, 0, 0],
    targetPos: [0, 0, 0],
  },
];

export const SCENE_TELEMETRY: string[] = [
  '640 hp · 5.2L V10',
  '15.0" Carbon-Ceramic · 20" Forged Wheels',
  '45.9" Height · Lateral V10 Intakes',
  '+35% Rear Downforce · Fixed Aero Wing',
  'Hexagonal Exhausts · 4-Strake Diffuser',
  '3,040 lbs Dry · 41 / 59 Weight Split',
  'Street · Sport · Track Cockpit Display',
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
    title: 'Y-Shape LED Headlights',
    kicker: 'Optical Precision',
    metric: 'Full LED Matrix',
    summary:
      'Signature twin Y-shaped daytime running lights sit recessed into sharp hexagonal housings, cutting cleanly through night stages with adaptive beam geometry.',
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
    kicker: 'Driver Interface',
    metric: 'Dynamic Telemetry Core',
    summary:
      'Low seating geometry, Alcantara surfaces, and an angled center console put telemetry, drive mode selectors, and the red flip-cover ignition at the driver’s fingertips.',
    details: [
      'Dedicated display graphics for Street, Sport, and Track modes',
      'Lightweight carbon-shell sport seats with laser-etched Alcantara',
      'Direct-mount aluminum paddle shifters behind hexagonal steering wheel',
    ],
    cameraSceneIndex: 6,
  },
];

export const HURACAN_VARIANT = {
  fullName: 'Lamborghini Huracán Tecnica',
  chassisCode: 'LB724 Factory Specification',
  tagline: 'The bridge between grand touring road performance and pure track precision.',
};

export const SPEC_COUNTERS: SpecCounter[] = [
  {
    id: 'power',
    value: 640,
    suffix: ' hp',
    label: 'Maximum Horsepower',
    detail: '631 SAE net hp / 470 kW @ 8,000 rpm',
  },
  {
    id: 'torque',
    value: 417,
    suffix: ' lb-ft',
    label: 'Maximum Torque',
    detail: '565 Nm @ 6,500 rpm',
  },
  {
    id: 'accel',
    value: 3.2,
    decimals: 1,
    suffix: ' s',
    label: '0–60 mph (0–100 km/h)',
    detail: '9.1 s to 124 mph (200 km/h)',
  },
  {
    id: 'top-speed',
    value: 202,
    suffix: ' mph',
    label: 'Top Speed',
    detail: '325 km/h electronically unlimited',
  },
  {
    id: 'displacement',
    value: 5.2,
    decimals: 1,
    suffix: ' L',
    label: 'Engine Displacement',
    detail: 'Naturally aspirated 90° V10 (318 cu in)',
  },
  {
    id: 'weight',
    value: 3040,
    suffix: ' lbs',
    label: 'Dry Weight',
    detail: '4.75 lbs/hp (1,379 kg) power-to-weight',
  },
];

export const VERIFIED_SPECS_TABLE: SpecRow[] = [
  { category: 'Model', label: 'Selected Variant', value: 'Lamborghini Huracán Tecnica' },
  { category: 'Engine', label: 'Engine Configuration', value: 'Naturally aspirated 10-cylinder 90° V10, dual MPI + DSI direct fuel injection' },
  { category: 'Engine', label: 'Engine Displacement', value: '5.2 Liters / 317.6 cu in (5,204 cc)' },
  { category: 'Output', label: 'Maximum Horsepower', value: '640 hp / 631 SAE hp (470 kW) @ 8,000 rpm' },
  { category: 'Output', label: 'Maximum Torque', value: '417 lb-ft (565 Nm) @ 6,500 rpm' },
  { category: 'Performance', label: '0–60 mph Acceleration', value: '3.1 s (0–100 km/h: 3.2 s)' },
  { category: 'Performance', label: '0–124 mph Acceleration', value: '9.1 s (0–200 km/h)' },
  { category: 'Performance', label: 'Top Speed', value: '202 mph (325 km/h)' },
  { category: 'Performance', label: 'Braking (62–0 mph)', value: '103.3 ft / 31.5 m (Carbon-Ceramic Brakes)' },
  { category: 'Drivetrain', label: 'Transmission', value: '7-speed dual-clutch automatic (LDF) with shift paddles' },
  { category: 'Drivetrain', label: 'Drive System', value: 'Rear-Wheel Drive (RWD) with Dynamic Vehicle Integration & Rear Steering' },
  { category: 'Structure', label: 'Dry Weight', value: '3,040 lbs / 1,379 kg (41% front / 59% rear distribution)' },
  { category: 'Structure', label: 'Chassis', value: 'Hybrid aluminum and carbon-fiber spaceframe' },
  { category: 'Dimensions', label: 'Length × Width × Height', value: '179.8 × 76.1 × 45.9 in (4,567 × 1,933 × 1,165 mm)' },
];

export const COCKPIT_HIGHLIGHTS: CockpitHighlight[] = [
  {
    id: 'driver-cockpit',
    title: 'Driver-Focused Cockpit',
    material: 'Forged Carbon & Jet Black Alcantara',
    description:
      'Every display screen and switch bank angles deliberately toward the driver seat, minimizing eye travel at triple-digit speeds.',
    detailMetric: 'Low-slung bucket seating',
  },
  {
    id: 'steering-wheel',
    title: 'Hexagonal Steering Wheel',
    material: 'Alcantara Rim & Carbon Spokes',
    description:
      'Flat-bottom hexagonal profile with thumb-accessible turn signals, drive-mode selector (Street, Sport, Track), and column-mounted shift paddles.',
    detailMetric: '3 Dynamic Drive Modes',
  },
  {
    id: 'digital-cluster',
    title: '12.3" Digital Instrument Cluster',
    material: 'Anti-Reflective High-Contrast Panel',
    description:
      'Reconfigures dynamically with drive mode—transforming from dual highway gauges into a central Track shift-light tachometer and tire pressure telemetry monitor.',
    detailMetric: '8,500 RPM Redline',
  },
  {
    id: 'center-console',
    title: 'Angled Console & Red Start Button',
    material: 'CNC Anodized Aluminum & Carbon Fiber',
    description:
      '8.4-inch vertical touchscreen paired with aircraft-style toggle switches and the iconic red flip-cover engine start button.',
    detailMetric: '8.4" Touchscreen + Tactile Toggles',
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
    title: 'Custom Interior Craftsmanship',
    material: 'Hand-Stitched Leather & Twill Carbon Fiber',
    description:
      'Zero glossy plastic glare surfaces. Matte Alcantara absorbs windshield reflections while hexagonal laser perforations vent cabin heat.',
    detailMetric: 'Handcrafted Precision',
  },
];

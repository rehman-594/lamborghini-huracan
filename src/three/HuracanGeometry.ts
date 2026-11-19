import * as THREE from 'three';

/**
 * High-density parametric CAD surface builders for the Lamborghini Huracán Tecnica.
 * Produces smooth compound-curved automotive bodywork with true circular wheel-arch
 * cutouts, recessed hood channel, muscular rear haunches, compound-curved windshield,
 * beveled Y-spokes, and arc-contoured monobloc brake calipers.
 */

interface BodyStation {
  z: number;
  wBottom: number;     // lower rocker / diffuser half-width
  wMid: number;        // mid-door scallop half-width (concave on flanks)
  wShoulder: number;   // beltline / fender arch peak half-width
  wTopCrest: number;   // hood crest / haunch ridge half-width
  yBottom: number;     // ground clearance height
  yMid: number;        // mid-door height
  yShoulder: number;   // beltline / fender peak height
  yCrest: number;      // fender crest height
  yCenter: number;     // center hood / roof-deck valley height
}

function catmullRomValue(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    0.5 *
    (2 * p1 +
      (-p0 + p2) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
  );
}

function sampleStations(stations: BodyStation[], count: number): BodyStation[] {
  const result: BodyStation[] = [];
  const n = stations.length;
  for (let i = 0; i < count; i++) {
    const u = (i / (count - 1)) * (n - 1);
    const idx = Math.min(Math.floor(u), n - 2);
    const t = u - idx;
    const s0 = stations[Math.max(0, idx - 1)];
    const s1 = stations[idx];
    const s2 = stations[Math.min(n - 1, idx + 1)];
    const s3 = stations[Math.min(n - 1, idx + 2)];

    result.push({
      z: catmullRomValue(s0.z, s1.z, s2.z, s3.z, t),
      wBottom: catmullRomValue(s0.wBottom, s1.wBottom, s2.wBottom, s3.wBottom, t),
      wMid: catmullRomValue(s0.wMid, s1.wMid, s2.wMid, s3.wMid, t),
      wShoulder: catmullRomValue(s0.wShoulder, s1.wShoulder, s2.wShoulder, s3.wShoulder, t),
      wTopCrest: catmullRomValue(s0.wTopCrest, s1.wTopCrest, s2.wTopCrest, s3.wTopCrest, t),
      yBottom: catmullRomValue(s0.yBottom, s1.yBottom, s2.yBottom, s3.yBottom, t),
      yMid: catmullRomValue(s0.yMid, s1.yMid, s2.yMid, s3.yMid, t),
      yShoulder: catmullRomValue(s0.yShoulder, s1.yShoulder, s2.yShoulder, s3.yShoulder, t),
      yCrest: catmullRomValue(s0.yCrest, s1.yCrest, s2.yCrest, s3.yCrest, t),
      yCenter: catmullRomValue(s0.yCenter, s1.yCenter, s2.yCenter, s3.yCenter, t),
    });
  }
  return result;
}

export function createHuracanBodyShell(): THREE.BufferGeometry {
  // Hand-calibrated Lamborghini Huracán Tecnica key cross-sections (rear -Z to front +Z)
  const keyStations: BodyStation[] = [
    // Closed rear tail cap & fascia (-2.24m to -2.06m)
    { z: -2.24, wBottom: 0.02, wMid: 0.02, wShoulder: 0.02, wTopCrest: 0.02, yBottom: 0.45, yMid: 0.52, yShoulder: 0.58, yCrest: 0.62, yCenter: 0.62 },
    { z: -2.21, wBottom: 0.72, wMid: 0.85, wShoulder: 0.89, wTopCrest: 0.74, yBottom: 0.34, yMid: 0.56, yShoulder: 0.75, yCrest: 0.79, yCenter: 0.78 },
    { z: -2.04, wBottom: 0.83, wMid: 0.93, wShoulder: 0.95, wTopCrest: 0.79, yBottom: 0.27, yMid: 0.55, yShoulder: 0.79, yCrest: 0.84, yCenter: 0.82 },
    // Rear muscular haunches & rear wheel center (-1.26m)
    { z: -1.66, wBottom: 0.88, wMid: 0.96, wShoulder: 0.98, wTopCrest: 0.80, yBottom: 0.19, yMid: 0.54, yShoulder: 0.82, yCrest: 0.89, yCenter: 0.86 },
    { z: -1.26, wBottom: 0.89, wMid: 0.97, wShoulder: 0.985, wTopCrest: 0.78, yBottom: 0.17, yMid: 0.54, yShoulder: 0.83, yCrest: 0.91, yCenter: 0.88 },
    { z: -0.88, wBottom: 0.87, wMid: 0.93, wShoulder: 0.955, wTopCrest: 0.74, yBottom: 0.15, yMid: 0.50, yShoulder: 0.80, yCrest: 0.90, yCenter: 0.88 },
    // Concave mid-door waist & side intake relief
    { z: -0.52, wBottom: 0.86, wMid: 0.845, wShoulder: 0.915, wTopCrest: 0.70, yBottom: 0.145, yMid: 0.45, yShoulder: 0.74, yCrest: 0.84, yCenter: 0.84 },
    { z: 0.0,   wBottom: 0.86, wMid: 0.83,  wShoulder: 0.905, wTopCrest: 0.69, yBottom: 0.145, yMid: 0.43, yShoulder: 0.72, yCrest: 0.79, yCenter: 0.79 },
    { z: 0.52,  wBottom: 0.86, wMid: 0.86,  wShoulder: 0.915, wTopCrest: 0.70, yBottom: 0.15, yMid: 0.45, yShoulder: 0.73, yCrest: 0.77, yCenter: 0.75 },
    // Front fender haunch & front wheel center (+1.36m)
    { z: 0.96,  wBottom: 0.86, wMid: 0.91, wShoulder: 0.94, wTopCrest: 0.73, yBottom: 0.16, yMid: 0.48, yShoulder: 0.74, yCrest: 0.77, yCenter: 0.71 },
    { z: 1.36,  wBottom: 0.85, wMid: 0.935, wShoulder: 0.95, wTopCrest: 0.73, yBottom: 0.17, yMid: 0.48, yCrest: 0.765, yShoulder: 0.735, yCenter: 0.66 },
    { z: 1.76,  wBottom: 0.80, wMid: 0.87, wShoulder: 0.89, wTopCrest: 0.67, yBottom: 0.175, yMid: 0.40, yShoulder: 0.58, yCrest: 0.61, yCenter: 0.54 },
    // Sharp low Lamborghini wedge nose (+2.08m to +2.27m)
    { z: 2.08,  wBottom: 0.68, wMid: 0.75, wShoulder: 0.76, wTopCrest: 0.54, yBottom: 0.175, yMid: 0.31, yShoulder: 0.42, yCrest: 0.44, yCenter: 0.40 },
    { z: 2.24,  wBottom: 0.46, wMid: 0.52, wShoulder: 0.50, wTopCrest: 0.36, yBottom: 0.185, yMid: 0.24, yShoulder: 0.29, yCrest: 0.30, yCenter: 0.28 },
    { z: 2.28,  wBottom: 0.02, wMid: 0.02, wShoulder: 0.02, wTopCrest: 0.02, yBottom: 0.21, yMid: 0.23, yShoulder: 0.24, yCrest: 0.25, yCenter: 0.25 },
  ];

  const stations = sampleStations(keyStations, 96);
  const halfPts = 17; // 0 (bottom center) -> 16 (top center) on one side
  const ringCount = halfPts * 2 - 1; // 33 points around full closed cross-section

  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const frontAxleZ = 1.36;
  const frontAxleY = 0.34;
  const frontArchR = 0.365;

  const rearAxleZ = -1.26;
  const rearAxleY = 0.355;
  const rearArchR = 0.385;

  for (let i = 0; i < stations.length; i++) {
    const s = stations[i];
    const v = i / (stations.length - 1);

    // Circular wheel-arch cutout + subtle fender lip flare
    const dzFront = Math.abs(s.z - frontAxleZ);
    const dzRear = Math.abs(s.z - rearAxleZ);

    let archCutY = 0;
    let archFlare = 0;
    if (dzFront < frontArchR) {
      archCutY = frontAxleY + Math.sqrt(Math.max(0, frontArchR * frontArchR - dzFront * dzFront));
      archFlare = 0.026 * Math.cos((dzFront / frontArchR) * (Math.PI / 2));
    } else if (dzRear < rearArchR) {
      archCutY = rearAxleY + Math.sqrt(Math.max(0, rearArchR * rearArchR - dzRear * dzRear));
      archFlare = 0.030 * Math.cos((dzRear / rearArchR) * (Math.PI / 2));
    }

    // Build right half cross-section (0 = bottom center -> 16 = top center)
    const ctrlPts: [number, number][] = [
      [0, s.yBottom],
      [s.wBottom * 0.62, s.yBottom + 0.008],
      [s.wBottom + archFlare * 0.5, Math.max(s.yBottom + 0.025, archCutY)],
      [s.wMid + archFlare * 0.9, Math.max(s.yMid, archCutY + 0.03)],
      [s.wShoulder + archFlare, Math.max(s.yShoulder, archCutY + 0.04)],
      [s.wTopCrest, s.yCrest],
      [s.wTopCrest * 0.48, s.yCrest * 0.42 + s.yCenter * 0.58],
      [0, s.yCenter],
    ];

    const halfCurve = new THREE.SplineCurve(
      ctrlPts.map(([x, y]) => new THREE.Vector2(x, y))
    );
    const sampledHalf = halfCurve.getPoints(halfPts - 1);

    // Full cross-section ring: right side bottom->top, then left side top->bottom
    const fullRing: [number, number][] = [];
    for (let k = 0; k < halfPts; k++) {
      fullRing.push([sampledHalf[k].x, sampledHalf[k].y]);
    }
    for (let k = halfPts - 2; k >= 0; k--) {
      fullRing.push([-sampledHalf[k].x, sampledHalf[k].y]);
    }

    for (let j = 0; j < ringCount; j++) {
      const [px, py] = fullRing[j];
      positions.push(px, py, s.z);
      uvs.push(j / (ringCount - 1), v);
    }
  }

  for (let i = 0; i < stations.length - 1; i++) {
    for (let j = 0; j < ringCount - 1; j++) {
      const a = i * ringCount + j;
      const b = (i + 1) * ringCount + j;
      const c = (i + 1) * ringCount + (j + 1);
      const d = i * ringCount + (j + 1);
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Compound-curved Huracán windshield that follows cowl camber and roof header sweep.
 */
export function createCurvedWindshieldGeometry(): THREE.BufferGeometry {
  const segU = 24;
  const segV = 16;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let iv = 0; iv <= segV; iv++) {
    const v = iv / segV; // 0 = cowl base, 1 = roof header
    const zBase = THREE.MathUtils.lerp(1.02, 0.16, v);
    const yBase = THREE.MathUtils.lerp(0.715, 1.155, Math.pow(v, 0.92));
    const halfW = THREE.MathUtils.lerp(0.67, 0.56, v);

    for (let iu = 0; iu <= segU; iu++) {
      const u = (iu / segU) * 2 - 1; // -1..+1
      const x = u * halfW;
      // Convex glass crown + aerodynamic wraparound sweepback at outer edges
      const crownY = (1 - u * u) * 0.032 * Math.sin(v * Math.PI);
      const wrapZ = -(u * u) * THREE.MathUtils.lerp(0.16, 0.05, v);
      positions.push(x, yBase + crownY, zBase + wrapZ);
      uvs.push(iu / segU, v);
    }
  }

  for (let iv = 0; iv < segV; iv++) {
    for (let iu = 0; iu < segU; iu++) {
      const a = iv * (segU + 1) + iu;
      const b = a + 1;
      const c = (iv + 1) * (segU + 1) + iu;
      const d = c + 1;
      indices.push(a, b, d);
      indices.push(a, d, c);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Sculpted double-bubble Huracán roof panel & rear deck flying buttresses.
 */
export function createSculptedRoofGeometry(): THREE.BufferGeometry {
  const segU = 24;
  const segV = 22;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let iv = 0; iv <= segV; iv++) {
    const v = iv / segV; // 0 = windshield header (+0.16), 1 = rear fastback base (-1.45)
    const z = THREE.MathUtils.lerp(0.16, -1.45, v);
    const ySpine =
      v < 0.25
        ? THREE.MathUtils.lerp(1.155, 1.175, v / 0.25)
        : THREE.MathUtils.lerp(1.175, 0.86, Math.pow((v - 0.25) / 0.75, 1.15));
    const halfW = THREE.MathUtils.lerp(0.56, 0.63, Math.sin(v * Math.PI * 0.6));

    for (let iu = 0; iu <= segU; iu++) {
      const u = (iu / segU) * 2 - 1;
      const x = u * halfW;
      // Subtle aerodynamic dome + bevel shoulder roll-off
      const dome = (1 - Math.pow(Math.abs(u), 2.2)) * 0.028;
      // Subtle rear fastback flying-buttress channel in center
      const buttressValley =
        v > 0.45 ? -(1 - Math.min(1, Math.abs(u) * 1.4)) * 0.045 * ((v - 0.45) / 0.55) : 0;
      const wrapZ = -(u * u) * 0.04;
      positions.push(x, ySpine + dome + buttressValley, z + wrapZ);
      uvs.push(iu / segU, v);
    }
  }

  for (let iv = 0; iv < segV; iv++) {
    for (let iu = 0; iu < segU; iu++) {
      const a = iv * (segU + 1) + iu;
      const b = a + 1;
      const c = (iv + 1) * (segU + 1) + iu;
      const d = c + 1;
      indices.push(a, b, d);
      indices.push(a, d, c);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Iconic Lamborghini Huracán hexagonal side greenhouse glass + pillar trim shape.
 */
export function createSideWindowGeometry(inset = 0): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  // Coordinates in (Z, Y) plane -> rotated onto car side
  shape.moveTo(0.84 - inset, 0.735 + inset);
  shape.lineTo(0.18, 1.135 - inset);
  shape.lineTo(-0.34, 1.13 - inset);
  shape.lineTo(-1.12 + inset, 0.875 + inset);
  shape.lineTo(-0.88 + inset, 0.81 + inset);
  shape.lineTo(-0.12, 0.755 + inset);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.018,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.008,
    bevelSegments: 2,
  });
  geo.rotateY(-Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Curved A-Pillar & roof rail arch beam for crisp Huracán greenhouse framing.
 */
export function createSidePillarArchGeometry(): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.68, 0.715, 0.90),
    new THREE.Vector3(0.60, 0.96, 0.52),
    new THREE.Vector3(0.56, 1.15, 0.14),
    new THREE.Vector3(0.57, 1.14, -0.35),
    new THREE.Vector3(0.63, 0.96, -1.02),
    new THREE.Vector3(0.66, 0.86, -1.44),
  ]);
  const geo = new THREE.TubeGeometry(curve, 36, 0.032, 10, false);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Sculpted carbon front splitter with upturned side aero winglets.
 */
export function createFrontSplitterGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(-0.86, 0.0);
  shape.lineTo(-0.78, 0.24);
  shape.lineTo(-0.42, 0.36);
  shape.lineTo(0.0, 0.40);
  shape.lineTo(0.42, 0.36);
  shape.lineTo(0.78, 0.24);
  shape.lineTo(0.86, 0.0);
  shape.lineTo(0.76, -0.06);
  shape.lineTo(-0.76, -0.06);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.022,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelSegments: 2,
  });
  geo.rotateX(Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Razor-thin beveled Ypsilon LED DRL blade for headlights & taillights.
 */
export function createYpsilonLEDGeometry(scale = 1): THREE.BufferGeometry {
  const s = scale;
  const shape = new THREE.Shape();
  // Horizontal main bar branching into twin Y arms
  shape.moveTo(-0.11 * s, 0.008 * s);
  shape.lineTo(0.03 * s, 0.008 * s);
  shape.lineTo(0.105 * s, 0.042 * s);
  shape.lineTo(0.112 * s, 0.032 * s);
  shape.lineTo(0.042 * s, 0.0);
  shape.lineTo(0.112 * s, -0.032 * s);
  shape.lineTo(0.105 * s, -0.042 * s);
  shape.lineTo(0.03 * s, -0.008 * s);
  shape.lineTo(-0.11 * s, -0.008 * s);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.012 * s,
    bevelEnabled: true,
    bevelThickness: 0.002 * s,
    bevelSize: 0.002 * s,
    bevelSegments: 1,
  });
  geo.center();
  geo.computeVertexNormals();
  return geo;
}

/**
 * Sculpted rear wing NACA airfoil blade with slight upward sweep at tips.
 */
export function createRearWingBladeGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(-0.155, 0.006);
  shape.quadraticCurveTo(-0.02, 0.036, 0.165, 0.014);
  shape.lineTo(0.155, -0.006);
  shape.quadraticCurveTo(0.0, 0.006, -0.155, -0.01);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 1.50,
    bevelEnabled: true,
    bevelThickness: 0.014,
    bevelSize: 0.01,
    bevelSegments: 2,
  });
  geo.center();
  geo.rotateY(-Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Hexagonal Lamborghini exhaust tip bezel.
 */
export function createHexTipGeometry(radius = 0.062, length = 0.19): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const x = Math.cos(a) * radius;
    const y = Math.sin(a) * radius * 0.8;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();

  const hole = new THREE.Path();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const x = Math.cos(a) * radius * 0.78;
    const y = Math.sin(a) * radius * 0.78 * 0.8;
    if (i === 0) hole.moveTo(x, y);
    else hole.lineTo(x, y);
  }
  hole.closePath();
  shape.holes.push(hole);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: length,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.006,
    bevelSegments: 2,
  });
  geo.center();
  geo.computeVertexNormals();
  return geo;
}

/**
 * Curved low-profile performance tire via high-segment LatheGeometry.
 */
export function createTireGeometry(outerRadius: number, width: number): THREE.BufferGeometry {
  const rimRadius = outerRadius * 0.725;
  const hw = width / 2;
  const pts = [
    new THREE.Vector2(rimRadius, -hw * 0.88),
    new THREE.Vector2(rimRadius + 0.014, -hw * 0.96),
    new THREE.Vector2(outerRadius * 0.87, -hw),
    new THREE.Vector2(outerRadius * 0.965, -hw * 0.93),
    new THREE.Vector2(outerRadius, -hw * 0.78),
    new THREE.Vector2(outerRadius, hw * 0.78),
    new THREE.Vector2(outerRadius * 0.965, hw * 0.93),
    new THREE.Vector2(outerRadius * 0.87, hw),
    new THREE.Vector2(rimRadius + 0.014, hw * 0.96),
    new THREE.Vector2(rimRadius, hw * 0.88),
  ];
  const geo = new THREE.LatheGeometry(pts, 64);
  geo.rotateZ(Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Concave stepped forged alloy rim barrel via LatheGeometry.
 */
export function createRimBarrelGeometry(rimRadius: number, width: number): THREE.BufferGeometry {
  const hw = width * 0.43;
  const pts = [
    new THREE.Vector2(rimRadius * 0.99, hw),
    new THREE.Vector2(rimRadius * 0.96, hw * 0.85),
    new THREE.Vector2(rimRadius * 0.90, hw * 0.45),
    new THREE.Vector2(rimRadius * 0.87, -hw * 0.55),
    new THREE.Vector2(rimRadius * 0.95, -hw * 0.92),
    new THREE.Vector2(rimRadius * 0.98, -hw),
  ];
  const geo = new THREE.LatheGeometry(pts, 48);
  geo.rotateZ(Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Sculpted Y-shaped forged alloy wheel spoke (tapered, beveled ExtrudeGeometry).
 */
export function createForgedYSpokeGeometry(rimRadius: number): THREE.BufferGeometry {
  const rInner = rimRadius * 0.24;
  const rFork = rimRadius * 0.50;
  const rOuter = rimRadius * 0.955;

  const shape = new THREE.Shape();
  // Build one sleek Y-spoke profile pointing along +Y
  shape.moveTo(-0.014, rInner);
  shape.lineTo(-0.011, rFork);
  shape.lineTo(-0.066, rOuter);
  shape.lineTo(-0.048, rOuter);
  shape.lineTo(0.0, rFork + 0.025);
  shape.lineTo(0.048, rOuter);
  shape.lineTo(0.066, rOuter);
  shape.lineTo(0.011, rFork);
  shape.lineTo(0.014, rInner);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.018,
    bevelEnabled: true,
    bevelThickness: 0.005,
    bevelSize: 0.004,
    bevelSegments: 2,
  });
  geo.rotateY(Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Curved arc-contoured 6-piston monobloc brake caliper hugging the rotor arc.
 */
export function createBrakeCaliperGeometry(rotorRadius: number): THREE.BufferGeometry {
  const rIn = rotorRadius * 0.68;
  const rOut = rotorRadius * 1.07;
  const span = 0.60;

  const shape = new THREE.Shape();
  const segs = 12;
  for (let i = 0; i <= segs; i++) {
    const a = -span + (i / segs) * (span * 2);
    const x = Math.cos(a) * rOut;
    const y = Math.sin(a) * rOut;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  for (let i = segs; i >= 0; i--) {
    const a = -span + (i / segs) * (span * 2);
    const x = Math.cos(a) * rIn;
    const y = Math.sin(a) * rIn;
    shape.lineTo(x, y);
  }
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.068,
    bevelEnabled: true,
    bevelThickness: 0.009,
    bevelSize: 0.007,
    bevelSegments: 2,
  });
  // Center only along extrusion depth (Z) so radial offset [rIn..rOut] stays on rotor rim
  geo.translate(0, 0, -0.034);
  geo.rotateY(Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

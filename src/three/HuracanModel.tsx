import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PaintFinish } from '../data/huracanData';
import {
  createBrakeCaliperGeometry,
  createCurvedWindshieldGeometry,
  createForgedYSpokeGeometry,
  createFrontSplitterGeometry,
  createHexTipGeometry,
  createHuracanBodyShell,
  createRearWingBladeGeometry,
  createRimBarrelGeometry,
  createSculptedRoofGeometry,
  createSidePillarArchGeometry,
  createSideWindowGeometry,
  createTireGeometry,
  createYpsilonLEDGeometry,
} from './HuracanGeometry';
import {
  createBrakeRotorTexture,
  createCarbonFiberTexture,
  createCenterCapTexture,
  createCockpitClusterTexture,
  createHexGrilleTexture,
  createTireTreadTexture,
} from './textures';

export interface HuracanModelProps {
  finish: PaintFinish;
  lightsOn: boolean;
  exploded: boolean;
  isSoftwareGl: boolean;
  scrollProgressRef: React.MutableRefObject<number>;
  /**
   * Optional future GLB/GLTF override URL.
   * Drop a scanned Huracán GLB here via React.Suspense + useGLTF(modelUrl)
   * while keeping the same scroll spline, lighting rig, and hotspots.
   */
  modelUrl?: string;
}

interface WheelProps {
  side: 'left' | 'right';
  axle: 'front' | 'rear';
  position: [number, number, number];
  explodedOffset: [number, number, number];
  exploded: boolean;
  caliperColor: string;
  rotorTexture: THREE.CanvasTexture;
  treadTexture: THREE.CanvasTexture;
  capTexture: THREE.CanvasTexture;
  scrollProgressRef: React.MutableRefObject<number>;
}

const WheelAssembly: React.FC<WheelProps> = ({
  side,
  axle,
  position,
  explodedOffset,
  exploded,
  caliperColor,
  rotorTexture,
  treadTexture,
  capTexture,
  scrollProgressRef,
}) => {
  const rootRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);
  const expFactor = useRef(0);

  const outerRadius = axle === 'front' ? 0.34 : 0.355;
  const tireWidth = axle === 'front' ? 0.255 : 0.305;
  const rimRadius = outerRadius * 0.725;
  const rotorRadius = rimRadius * 0.80;
  const dir = side === 'right' ? 1 : -1;

  const tireGeo = useMemo(() => createTireGeometry(outerRadius, tireWidth), [outerRadius, tireWidth]);
  const barrelGeo = useMemo(() => createRimBarrelGeometry(rimRadius, tireWidth), [rimRadius, tireWidth]);
  const spokeGeo = useMemo(() => createForgedYSpokeGeometry(rimRadius), [rimRadius]);
  const caliperGeo = useMemo(() => createBrakeCaliperGeometry(rotorRadius), [rotorRadius]);

  const spokeAngles = useMemo(() => [0, 1, 2, 3, 4].map((i) => (i * Math.PI * 2) / 5), []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    expFactor.current = THREE.MathUtils.damp(expFactor.current, exploded ? 1 : 0, 5.5, dt);

    if (rootRef.current) {
      rootRef.current.position.set(
        position[0] + explodedOffset[0] * expFactor.current,
        position[1] + explodedOffset[1] * expFactor.current,
        position[2] + explodedOffset[2] * expFactor.current
      );
    }

    if (spinRef.current) {
      spinRef.current.rotation.x = scrollProgressRef.current * Math.PI * 10;
    }
  });

  // Front caliper sits upper-rear (-Z/+Y); rear caliper sits upper-front (+Z/+Y)
  const caliperAngle = axle === 'front' ? 0.28 : Math.PI - 0.28;

  return (
    <group ref={rootRef} position={position}>
      {/* Rotating Wheel, Forged Y-Spokes & Cross-Drilled CCB Disc */}
      <group ref={spinRef}>
        <mesh geometry={tireGeo} castShadow receiveShadow>
          <meshStandardMaterial
            color="#191a1e"
            bumpMap={treadTexture}
            bumpScale={0.008}
            roughness={0.84}
            metalness={0.04}
          />
        </mesh>

        {/* Stepped Concave Forged Rim Barrel */}
        <mesh geometry={barrelGeo} castShadow>
          <meshPhysicalMaterial
            color="#1c1e24"
            metalness={0.92}
            roughness={0.22}
            clearcoat={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Diamond-cut outer rim lip */}
        <mesh position={[dir * (tireWidth * 0.42), 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[rimRadius * 0.985, 0.009, 12, 48]} />
          <meshStandardMaterial color="#8f95a3" metalness={0.96} roughness={0.14} />
        </mesh>

        {/* Concave Forged Center Hub */}
        <mesh position={[dir * (tireWidth * 0.24), 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.068, 0.082, 0.055, 28]} />
          <meshStandardMaterial color="#181a20" metalness={0.9} roughness={0.22} />
        </mesh>

        {/* Gold Bull Center-Lock Crest Cap */}
        <mesh
          position={[dir * (tireWidth * 0.285), 0, 0]}
          rotation={[0, dir > 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
        >
          <circleGeometry args={[0.036, 28]} />
          <meshStandardMaterial map={capTexture} metalness={0.6} roughness={0.26} />
        </mesh>

        {/* 5 Sculpted Tapered Y-Spokes (angled inward for authentic rear concavity) */}
        {spokeAngles.map((ang, idx) => (
          <group key={idx} rotation={[ang, 0, 0]}>
            <mesh
              geometry={spokeGeo}
              position={[dir * (tireWidth * 0.26), 0, 0]}
              rotation={[0, 0, -dir * (axle === 'rear' ? 0.19 : 0.14)]}
              castShadow
            >
              <meshPhysicalMaterial
                color="#262932"
                metalness={0.94}
                roughness={0.19}
                clearcoat={0.65}
                clearcoatRoughness={0.12}
              />
            </mesh>
            {/* Recessed titanium lug bolt */}
            <mesh
              position={[dir * (tireWidth * 0.28), rimRadius * 0.19, 0]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.008, 0.008, 0.022, 6]} />
              <meshStandardMaterial color="#b4bac7" metalness={0.95} roughness={0.18} />
            </mesh>
          </group>
        ))}

        {/* Cross-drilled Carbon-Ceramic Brake Rotor */}
        <mesh position={[dir * 0.015, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[rotorRadius, rotorRadius, 0.024, 48]} />
          <meshStandardMaterial
            map={rotorTexture}
            color="#a7adb9"
            metalness={0.58}
            roughness={0.38}
          />
        </mesh>
      </group>

      {/* Stationary Curved 6-Piston Monobloc Caliper */}
      <group rotation={[caliperAngle, 0, 0]}>
        <mesh geometry={caliperGeo} position={[dir * 0.028, 0, 0]} castShadow>
          <meshPhysicalMaterial
            color={caliperColor}
            metalness={0.58}
            roughness={0.22}
            clearcoat={0.95}
            clearcoatRoughness={0.08}
          />
        </mesh>
      </group>
    </group>
  );
};

export const HuracanModel: React.FC<HuracanModelProps> = ({
  finish,
  lightsOn,
  exploded,
  isSoftwareGl,
  scrollProgressRef,
}) => {
  const { gl } = useThree();
  const maxAniso = useMemo(() => gl.capabilities.getMaxAnisotropy?.() || 4, [gl]);

  const carbonTex = useMemo(() => createCarbonFiberTexture(maxAniso), [maxAniso]);
  const hexGrilleTex = useMemo(() => createHexGrilleTexture(maxAniso), [maxAniso]);
  const rotorTex = useMemo(() => createBrakeRotorTexture(maxAniso), [maxAniso]);
  const treadTex = useMemo(() => createTireTreadTexture(maxAniso), [maxAniso]);
  const capTex = useMemo(() => createCenterCapTexture(maxAniso), [maxAniso]);
  const clusterTex = useMemo(() => createCockpitClusterTexture(), []);

  const bodyGeo = useMemo(() => createHuracanBodyShell(), []);
  const windshieldGeo = useMemo(() => createCurvedWindshieldGeometry(), []);
  const roofGeo = useMemo(() => createSculptedRoofGeometry(), []);
  const sideWinGeo = useMemo(() => createSideWindowGeometry(0), []);
  const pillarArchGeo = useMemo(() => createSidePillarArchGeometry(), []);
  const splitterGeo = useMemo(() => createFrontSplitterGeometry(), []);
  const frontYGeo = useMemo(() => createYpsilonLEDGeometry(1.0), []);
  const rearYGeo = useMemo(() => createYpsilonLEDGeometry(1.32), []);
  const wingGeo = useMemo(() => createRearWingBladeGeometry(), []);
  const hexTipGeo = useMemo(() => createHexTipGeometry(0.062, 0.19), []);

  const splitterRef = useRef<THREE.Group>(null);
  const engineCoverRef = useRef<THREE.Group>(null);
  const wingRef = useRef<THREE.Group>(null);
  const canopyRef = useRef<THREE.Group>(null);
  const expSmooth = useRef(0);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    expSmooth.current = THREE.MathUtils.damp(expSmooth.current, exploded ? 1 : 0, 5.2, dt);
    const e = expSmooth.current;

    if (splitterRef.current) {
      splitterRef.current.position.set(0, -0.04 * e, 0.34 * e);
    }
    if (engineCoverRef.current) {
      engineCoverRef.current.position.set(0, 0.42 * e, -0.14 * e);
    }
    if (wingRef.current) {
      wingRef.current.position.set(0, 0.28 * e, -0.24 * e);
    }
    if (canopyRef.current) {
      canopyRef.current.position.set(0, 0.34 * e, 0);
    }
  });

  const paintProps = {
    color: finish.hex,
    metalness: finish.metalness,
    roughness: finish.roughness,
    clearcoat: finish.clearcoat,
    clearcoatRoughness: finish.clearcoatRoughness,
    envMapIntensity: 1.45,
  };

  const glassProps = {
    color: '#0d1117',
    metalness: 0.08,
    roughness: 0.04,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
    transmission: isSoftwareGl ? 0 : 0.72,
    transparent: true,
    opacity: isSoftwareGl ? 0.52 : 0.92,
    ior: 1.52,
    thickness: 0.14,
    depthWrite: false,
    envMapIntensity: 1.6,
  };

  return (
    <group name="HuracanTecnicaGroup" position={[0, 0, 0]}>
      {/* 1. HIGH-DENSITY SCULPTED LAMBORGHINI BODY SHELL */}
      <mesh geometry={bodyGeo} castShadow receiveShadow>
        <meshPhysicalMaterial {...paintProps} />
      </mesh>

      {/* Recessed Matte Black Wheel-Well Tubs (eliminates see-through gaps around all 4 wheels) */}
      {[
        [0.74, 0.34, 1.36, 0.385, 0.32],
        [-0.74, 0.34, 1.36, 0.385, 0.32],
        [0.76, 0.355, -1.26, 0.40, 0.36],
        [-0.76, 0.355, -1.26, 0.40, 0.36],
      ].map(([wx, wy, wz, wr, ww], idx) => (
        <mesh
          key={`wheel-well-${idx}`}
          position={[wx, wy, wz]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[wr, wr, ww, 32, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#060709" roughness={0.94} side={THREE.BackSide} />
        </mesh>
      ))}

      {/* Nose Crest Shield Badge */}
      <mesh position={[0, 0.415, 2.08]} rotation={[-0.45, 0, 0]}>
        <cylinderGeometry args={[0.026, 0.026, 0.008, 16]} />
        <meshStandardMaterial map={capTex} metalness={0.7} roughness={0.25} />
      </mesh>

      {/* 2. COMPOUND-CURVED GREENHOUSE CANOPY, WINDSHIELD & HEX SIDE GLASS */}
      <group ref={canopyRef}>
        {/* Double-bubble sculpted roof & flying buttresses */}
        <mesh geometry={roofGeo} castShadow receiveShadow>
          <meshPhysicalMaterial {...paintProps} side={THREE.DoubleSide} />
        </mesh>

        {/* Compound-curved tinted windshield */}
        <mesh geometry={windshieldGeo} renderOrder={4}>
          <meshPhysicalMaterial {...glassProps} side={THREE.DoubleSide} />
        </mesh>

        {/* Gloss-black sculpted A-pillar & roof rail arches */}
        <mesh geometry={pillarArchGeo} castShadow>
          <meshPhysicalMaterial color="#0e0f13" metalness={0.5} roughness={0.2} clearcoat={0.9} />
        </mesh>
        <mesh geometry={pillarArchGeo} scale={[-1, 1, 1]} castShadow>
          <meshPhysicalMaterial color="#0e0f13" metalness={0.5} roughness={0.2} clearcoat={0.9} />
        </mesh>

        {/* Iconic Huracán Hexagonal Side Glass Windows */}
        <mesh
          geometry={sideWinGeo}
          position={[0.635, 0, 0]}
          rotation={[0, -0.045, 0]}
          renderOrder={4}
        >
          <meshPhysicalMaterial {...glassProps} />
        </mesh>
        <mesh
          geometry={sideWinGeo}
          position={[-0.617, 0, 0]}
          rotation={[0, 0.045, 0]}
          renderOrder={4}
        >
          <meshPhysicalMaterial {...glassProps} />
        </mesh>

        {/* Sculpted Aerodynamic Wing Mirrors on Carbon Stalks */}
        {([-1, 1] as const).map((side) => (
          <group key={`mirror-${side}`} position={[side * 0.94, 0.76, 0.56]}>
            <mesh position={[-side * 0.06, -0.025, -0.01]} rotation={[0, 0, side * 0.42]}>
              <boxGeometry args={[0.13, 0.02, 0.045]} />
              <meshStandardMaterial map={carbonTex} color="#1d2027" roughness={0.34} metalness={0.48} />
            </mesh>
            <mesh rotation={[0.04, side * -0.22, side * 0.06]} scale={[1.35, 0.62, 0.95]} castShadow>
              <sphereGeometry args={[0.065, 20, 16]} />
              <meshPhysicalMaterial {...paintProps} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 3. INTERIOR COCKPIT */}
      <group name="CockpitInterior" position={[0, 0.44, 0.08]}>
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[1.16, 0.04, 1.32]} />
          <meshStandardMaterial color="#0a0b0e" roughness={0.94} />
        </mesh>

        {/* Angled carbon center console tunnel */}
        <mesh position={[0, 0.03, 0.14]} rotation={[-0.26, 0, 0]}>
          <boxGeometry args={[0.17, 0.15, 0.92]} />
          <meshStandardMaterial map={carbonTex} color="#1e2027" roughness={0.4} metalness={0.38} />
        </mesh>

        {/* Red fighter-jet flip-switch ignition */}
        <mesh position={[0, 0.095, 0.24]}>
          <boxGeometry args={[0.042, 0.022, 0.06]} />
          <meshStandardMaterial
            color="#dc2626"
            emissive="#991b1b"
            emissiveIntensity={lightsOn ? 0.7 : 0.15}
            roughness={0.28}
            metalness={0.4}
          />
        </mesh>

        {/* Alcantara dashboard cowl */}
        <mesh position={[0, 0.215, 0.50]}>
          <boxGeometry args={[1.12, 0.13, 0.34]} />
          <meshStandardMaterial color="#111318" roughness={0.88} />
        </mesh>

        {/* Digital TFT Instrument Cluster */}
        <mesh position={[0.30, 0.235, 0.325]} rotation={[0.12, Math.PI, 0]}>
          <planeGeometry args={[0.28, 0.12]} />
          <meshStandardMaterial
            map={clusterTex}
            emissiveMap={clusterTex}
            emissive="#ffffff"
            emissiveIntensity={lightsOn ? 1.2 : 0.35}
            roughness={0.2}
          />
        </mesh>

        {/* Hexagonal Steering Wheel + Paddles */}
        <group position={[0.30, 0.215, 0.19]} rotation={[-0.18, 0, 0]}>
          <mesh>
            <torusGeometry args={[0.14, 0.016, 10, 6]} />
            <meshStandardMaterial color="#181a1f" roughness={0.84} />
          </mesh>
          <mesh position={[0, 0.138, 0]}>
            <boxGeometry args={[0.02, 0.024, 0.024]} />
            <meshStandardMaterial color="#dc2626" roughness={0.4} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.052, 0.052, 0.028, 6]} />
            <meshStandardMaterial color="#13151a" roughness={0.6} metalness={0.35} />
          </mesh>
          <mesh position={[0.105, 0.02, 0.038]}>
            <boxGeometry args={[0.01, 0.105, 0.03]} />
            <meshStandardMaterial color="#9ea4b2" metalness={0.92} roughness={0.2} />
          </mesh>
          <mesh position={[-0.105, 0.02, 0.038]}>
            <boxGeometry args={[0.01, 0.105, 0.03]} />
            <meshStandardMaterial color="#9ea4b2" metalness={0.92} roughness={0.2} />
          </mesh>
        </group>

        {/* Carbon-Shell Bucket Seats */}
        {([-0.30, 0.30] as const).map((sx, idx) => (
          <group key={`seat-${idx}`} position={[sx, -0.04, -0.18]}>
            <mesh position={[0, 0, 0.12]} rotation={[0.08, 0, 0]}>
              <boxGeometry args={[0.36, 0.08, 0.40]} />
              <meshStandardMaterial color="#14161b" roughness={0.86} />
            </mesh>
            <mesh position={[0, 0.23, -0.08]} rotation={[-0.28, 0, 0]}>
              <boxGeometry args={[0.34, 0.46, 0.08]} />
              <meshStandardMaterial color="#16181e" roughness={0.84} />
            </mesh>
            <mesh position={[0, 0.49, -0.16]} rotation={[-0.18, 0, 0]}>
              <boxGeometry args={[0.18, 0.15, 0.07]} />
              <meshStandardMaterial color="#13151a" roughness={0.84} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 4. SCULPTED CARBON FRONT SPLITTER, HEXAGONAL GRILLE & YPSILON HEADLIGHTS */}
      <group ref={splitterRef}>
        <mesh geometry={splitterGeo} position={[0, 0.175, 1.88]} castShadow receiveShadow>
          <meshStandardMaterial map={carbonTex} color="#1d1f26" roughness={0.34} metalness={0.48} />
        </mesh>

        {/* Recessed Central Front Hexagonal Grille */}
        <mesh position={[0, 0.225, 2.20]} rotation={[-0.18, 0, 0]}>
          <boxGeometry args={[0.88, 0.10, 0.06]} />
          <meshStandardMaterial map={hexGrilleTex} color="#121318" roughness={0.7} metalness={0.35} />
        </mesh>

        {/* Tecnica Y-Shaped Front Air Curtain Canards */}
        {([-1, 1] as const).map((side) => (
          <group
            key={`curtain-${side}`}
            position={[side * 0.56, 0.25, 2.02]}
            rotation={[0, side * 0.42, 0]}
          >
            <mesh>
              <boxGeometry args={[0.30, 0.13, 0.14]} />
              <meshStandardMaterial map={hexGrilleTex} color="#0b0c0f" roughness={0.78} />
            </mesh>
            <mesh position={[0, 0.02, 0.07]} rotation={[0, 0, side * 0.44]}>
              <boxGeometry args={[0.25, 0.018, 0.035]} />
              <meshStandardMaterial map={carbonTex} color="#252831" roughness={0.32} metalness={0.5} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Recessed Angular LED Matrix Headlights with Twin-Ypsilon DRLs */}
      {([-1, 1] as const).map((side) => (
        <group
          key={`headlight-${side}`}
          position={[side * 0.59, 0.465, 1.86]}
          rotation={[0.34, side * 0.34, -side * 0.15]}
        >
          {/* Dark interior bezel */}
          <mesh>
            <boxGeometry args={[0.25, 0.055, 0.18]} />
            <meshStandardMaterial color="#08090c" roughness={0.28} metalness={0.65} />
          </mesh>
          {/* Twin spherical projector optics */}
          <mesh position={[-side * 0.05, 0, 0.075]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.02, 16]} />
            <meshStandardMaterial
              color="#d8e6ff"
              emissive="#eef5ff"
              emissiveIntensity={lightsOn ? 2.2 : 0.1}
            />
          </mesh>
          {/* Razor-thin beveled Ypsilon LED DRL */}
          <mesh
            geometry={frontYGeo}
            position={[0, 0.004, 0.09]}
            rotation={[0, 0, side > 0 ? Math.PI : 0]}
          >
            <meshStandardMaterial
              color="#ffffff"
              emissive="#f0f6ff"
              emissiveIntensity={lightsOn ? 4.2 : 0.2}
              toneMapped={false}
            />
          </mesh>
          {/* Outer clear polycarbonate lens */}
          <mesh position={[0, 0.005, 0.095]}>
            <boxGeometry args={[0.26, 0.06, 0.014]} />
            <meshPhysicalMaterial {...glassProps} />
          </mesh>
        </group>
      ))}

      {/* 5. SCULPTED SIDE SKIRTS & HEXAGONAL INTAKES */}
      {([-1, 1] as const).map((side) => (
        <group key={`flank-${side}`}>
          {/* Carbon-fiber side rocker blade */}
          <mesh position={[side * 0.87, 0.14, 0.0]} castShadow>
            <boxGeometry args={[0.06, 0.036, 1.84]} />
            <meshStandardMaterial map={carbonTex} color="#1d1f26" roughness={0.34} metalness={0.48} />
          </mesh>
          {/* Recessed lower side intake + horizontal aero vane */}
          <mesh position={[side * 0.885, 0.32, -0.68]} rotation={[0, side * 0.12, 0]}>
            <boxGeometry args={[0.08, 0.21, 0.44]} />
            <meshStandardMaterial map={hexGrilleTex} color="#090a0d" roughness={0.82} />
          </mesh>
          <mesh position={[side * 0.915, 0.33, -0.68]} rotation={[0, side * 0.08, 0]}>
            <boxGeometry args={[0.04, 0.018, 0.42]} />
            <meshPhysicalMaterial {...paintProps} />
          </mesh>
          {/* Upper shoulder cooling duct */}
          <mesh position={[side * 0.835, 0.72, -0.78]} rotation={[0, side * 0.12, 0]}>
            <boxGeometry args={[0.07, 0.11, 0.34]} />
            <meshStandardMaterial map={hexGrilleTex} color="#090a0d" roughness={0.82} />
          </mesh>
        </group>
      ))}

      {/* 6. MID-REAR 5.2L V10 ENGINE BAY */}
      <group name="V10EngineBay" position={[0, 0.68, -1.16]}>
        <mesh position={[0, -0.04, 0]}>
          <boxGeometry args={[0.56, 0.17, 0.70]} />
          <meshStandardMaterial color="#181a20" metalness={0.85} roughness={0.32} />
        </mesh>
        {([-1, 1] as const).map((bank) => (
          <group key={`v10-bank-${bank}`} position={[bank * 0.155, 0.07, 0]} rotation={[0, 0, -bank * 0.36]}>
            <mesh>
              <boxGeometry args={[0.165, 0.072, 0.62]} />
              <meshPhysicalMaterial
                color="#b58a44"
                metalness={0.86}
                roughness={0.26}
                clearcoat={0.4}
              />
            </mesh>
            {/* 5 individual intake velocity runners per bank */}
            {[-0.22, -0.11, 0, 0.11, 0.22].map((rz, rIdx) => (
              <mesh key={`runner-${rIdx}`} position={[-bank * 0.06, 0.045, rz]}>
                <cylinderGeometry args={[0.022, 0.024, 0.06, 12]} />
                <meshStandardMaterial color="#8d93a1" metalness={0.92} roughness={0.24} />
              </mesh>
            ))}
          </group>
        ))}
        {/* Forged Carbon Structural X-Brace */}
        <mesh position={[0, 0.135, 0]} rotation={[0, 0.56, 0]}>
          <boxGeometry args={[0.03, 0.016, 0.84]} />
          <meshStandardMaterial map={carbonTex} color="#282b33" roughness={0.32} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.135, 0]} rotation={[0, -0.56, 0]}>
          <boxGeometry args={[0.03, 0.016, 0.84]} />
          <meshStandardMaterial map={carbonTex} color="#282b33" roughness={0.32} metalness={0.5} />
        </mesh>
      </group>

      {/* Louvered Glass Rear Engine Cover */}
      <group ref={engineCoverRef}>
        <mesh position={[0, 0.87, -1.18]} rotation={[0.05, 0, 0]} renderOrder={4}>
          <boxGeometry args={[0.84, 0.014, 0.80]} />
          <meshPhysicalMaterial {...glassProps} />
        </mesh>
        {[-0.92, -1.10, -1.28, -1.46].map((lz, idx) => (
          <mesh key={`louver-${idx}`} position={[0, 0.88, lz]} rotation={[0.24, 0, 0]} castShadow>
            <boxGeometry args={[0.82, 0.014, 0.042]} />
            <meshPhysicalMaterial color="#14161b" roughness={0.34} metalness={0.6} clearcoat={0.5} />
          </mesh>
        ))}
      </group>

      {/* 7. REAR FASCIA: HEX MESH, Y-TAILLIGHTS, HEX EXHAUSTS, 4-STRAKE DIFFUSER & WING */}
      <mesh position={[0, 0.53, -2.18]}>
        <boxGeometry args={[1.56, 0.24, 0.06]} />
        <meshStandardMaterial map={hexGrilleTex} color="#0d0e12" roughness={0.72} metalness={0.32} />
      </mesh>

      {/* Sharp Y-Pattern LED Taillights */}
      {([-1, 1] as const).map((side) => (
        <mesh
          key={`taillight-${side}`}
          geometry={rearYGeo}
          position={[side * 0.56, 0.62, -2.20]}
          rotation={[0, 0, side > 0 ? Math.PI : 0]}
        >
          <meshStandardMaterial
            color="#ff2419"
            emissive="#ff1e14"
            emissiveIntensity={lightsOn ? 4.4 : 0.28}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Dual High-Mounted Hexagonal Exhausts */}
      {([-0.24, 0.24] as const).map((ex, idx) => (
        <group key={`exhaust-${idx}`} position={[ex, 0.49, -2.20]}>
          <mesh geometry={hexTipGeo}>
            <meshStandardMaterial color="#1f2128" metalness={0.92} roughness={0.24} />
          </mesh>
          <mesh position={[0, 0, -0.04]}>
            <cylinderGeometry args={[0.038, 0.038, 0.04, 6]} />
            <meshStandardMaterial
              color="#ff6d2b"
              emissive="#b83808"
              emissiveIntensity={lightsOn ? 0.6 : 0.1}
              metalness={0.7}
              roughness={0.35}
            />
          </mesh>
        </group>
      ))}

      {/* Aggressive 4-Strake Carbon Rear Diffuser */}
      <group position={[0, 0.22, -2.11]}>
        <mesh castShadow>
          <boxGeometry args={[1.44, 0.10, 0.24]} />
          <meshStandardMaterial map={carbonTex} color="#17191f" roughness={0.34} metalness={0.45} />
        </mesh>
        {[-0.48, -0.16, 0.16, 0.48].map((fx, idx) => (
          <mesh key={`fin-${idx}`} position={[fx, -0.03, -0.04]} castShadow>
            <boxGeometry args={[0.02, 0.115, 0.28]} />
            <meshStandardMaterial map={carbonTex} color="#242730" roughness={0.3} metalness={0.5} />
          </mesh>
        ))}
      </group>

      {/* Fixed Sculpted Rear Airfoil Wing */}
      <group ref={wingRef}>
        <mesh geometry={wingGeo} position={[0, 0.945, -1.96]} castShadow>
          <meshPhysicalMaterial {...paintProps} />
        </mesh>
        {([-1, 1] as const).map((side) => (
          <mesh key={`endplate-${side}`} position={[side * 0.76, 0.94, -1.96]} castShadow>
            <boxGeometry args={[0.016, 0.076, 0.34]} />
            <meshStandardMaterial map={carbonTex} color="#1c1e25" roughness={0.34} metalness={0.48} />
          </mesh>
        ))}
        {([-0.38, 0.38] as const).map((ux, idx) => (
          <mesh key={`upright-${idx}`} position={[ux, 0.875, -1.95]} rotation={[0.18, 0, 0]} castShadow>
            <boxGeometry args={[0.022, 0.14, 0.12]} />
            <meshStandardMaterial color="#14161b" roughness={0.35} metalness={0.72} />
          </mesh>
        ))}
      </group>

      {/* 8. FOUR FORGED 20" DAMISO WHEELS & CARBON-CERAMIC BRAKES */}
      <WheelAssembly
        side="right"
        axle="front"
        position={[0.835, 0.34, 1.36]}
        explodedOffset={[0.42, 0, 0]}
        exploded={exploded}
        caliperColor={finish.caliperHex}
        rotorTexture={rotorTex}
        treadTexture={treadTex}
        capTexture={capTex}
        scrollProgressRef={scrollProgressRef}
      />
      <WheelAssembly
        side="left"
        axle="front"
        position={[-0.835, 0.34, 1.36]}
        explodedOffset={[-0.42, 0, 0]}
        exploded={exploded}
        caliperColor={finish.caliperHex}
        rotorTexture={rotorTex}
        treadTexture={treadTex}
        capTexture={capTex}
        scrollProgressRef={scrollProgressRef}
      />
      <WheelAssembly
        side="right"
        axle="rear"
        position={[0.865, 0.355, -1.26]}
        explodedOffset={[0.45, 0, 0]}
        exploded={exploded}
        caliperColor={finish.caliperHex}
        rotorTexture={rotorTex}
        treadTexture={treadTex}
        capTexture={capTex}
        scrollProgressRef={scrollProgressRef}
      />
      <WheelAssembly
        side="left"
        axle="rear"
        position={[-0.865, 0.355, -1.26]}
        explodedOffset={[-0.45, 0, 0]}
        exploded={exploded}
        caliperColor={finish.caliperHex}
        rotorTexture={rotorTex}
        treadTexture={treadTex}
        capTexture={capTex}
        scrollProgressRef={scrollProgressRef}
      />
    </group>
  );
};

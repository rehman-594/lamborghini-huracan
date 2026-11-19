import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import {
  CAR_HOTSPOTS,
  CarHotspot,
  PaintFinish,
  SCROLL_SCENES,
} from '../data/huracanData';
import { HuracanModel } from './HuracanModel';
import { createFloorGlowTexture } from './textures';

export interface ShowroomStageProps {
  finish: PaintFinish;
  lightsOn: boolean;
  exploded: boolean;
  orbitMode: boolean;
  cockpitMode: boolean;
  showHotspots: boolean;
  activeHotspot: CarHotspot | null;
  onSelectHotspot: (hotspot: CarHotspot | null) => void;
  scrollProgressRef: React.MutableRefObject<number>;
  onDragInteract?: () => void;
}

function detectSoftwareWebGL(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return false;
  }
}

// Pre-allocated math helpers outside frame loop (zero GC)
const _splineCamPos = new THREE.Vector3();
const _splineTargetPos = new THREE.Vector3();
const _desiredCamPos = new THREE.Vector3();
const _desiredTargetPos = new THREE.Vector3();
const _currentLookAt = new THREE.Vector3(0, 0.52, 0);
const _offsetVec = new THREE.Vector3();

interface StudioEnvironmentProps {
  isSoftwareGl: boolean;
}

const StudioEnvironment: React.FC<StudioEnvironmentProps> = ({ isSoftwareGl }) => {
  const { gl, scene } = useThree();
  const floorGlowTex = useMemo(() => createFloorGlowTexture(), []);

  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();

    // Custom procedural automotive softbox studio for realistic car-paint clearcoat streaks
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color('#090a0e');

    const addSoftbox = (
      w: number,
      h: number,
      pos: [number, number, number],
      look: [number, number, number],
      colorHex: string,
      intensity: number
    ) => {
      const geo = new THREE.PlaneGeometry(w, h);
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(colorHex).multiplyScalar(intensity),
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      mesh.lookAt(...look);
      envScene.add(mesh);
      return { geo, mat };
    };

    const disposables: { geo: THREE.BufferGeometry; mat: THREE.Material }[] = [
      // Long overhead key softbox strip (creates iconic hood/roof highlight)
      addSoftbox(2.2, 13.5, [0, 6.5, 0], [0, 0, 0], '#ffffff', 5.2),
      // Flank warm & cool linear strips for door scallop & rear haunch reflections
      addSoftbox(14.0, 1.3, [7.5, 2.3, 0], [0, 0.5, 0], '#fff2dc', 3.4),
      addSoftbox(14.0, 1.3, [-7.5, 2.3, 0], [0, 0.5, 0], '#d4e4ff', 3.1),
      // Upper diagonal rim strips
      addSoftbox(12.0, 0.85, [5.2, 5.2, 0], [0, 0.4, 0], '#ffffff', 3.8),
      addSoftbox(12.0, 0.85, [-5.2, 5.2, 0], [0, 0.4, 0], '#e6efff', 3.4),
      // Front & rear low fill bands
      addSoftbox(9.0, 1.4, [0, 1.8, 8.5], [0, 0.4, 0], '#f8f5ef', 2.4),
      addSoftbox(9.0, 1.4, [0, 1.8, -8.5], [0, 0.4, 0], '#dbe7ff', 2.2),
    ];

    const envRT = pmremGenerator.fromScene(envScene, 0.025);
    scene.environment = envRT.texture;

    disposables.forEach((d) => {
      d.geo.dispose();
      d.mat.dispose();
    });
    pmremGenerator.dispose();

    return () => {
      envRT.dispose();
    };
  }, [gl, scene]);

  return (
    <>
      <color attach="background" args={['#050506']} />
      <fogExp2 attach="fog" args={['#050506', 0.042]} />

      {/* Warm Key Light + Cool Sky/Ground Fill + Crisp Back Rim */}
      <hemisphereLight args={['#a9c2e8', '#0e1015', 0.95]} />
      <directionalLight
        position={[4.8, 6.2, 5.2]}
        intensity={2.8}
        color="#fff3e0"
        castShadow={!isSoftwareGl}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={22}
        shadow-camera-left={-4.5}
        shadow-camera-right={4.5}
        shadow-camera-top={4.5}
        shadow-camera-bottom={-4.5}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <directionalLight position={[-5.5, 3.6, -4.8]} intensity={2.2} color="#b7ceff" />
      <spotLight
        position={[0, 7.5, 0.5]}
        angle={0.52}
        penumbra={0.85}
        intensity={2.6}
        color="#f7f4ec"
      />

      {/* Overhead Architectural Studio Light Bars */}
      <mesh position={[0, 4.6, 0]}>
        <boxGeometry args={[0.14, 0.03, 5.6]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2.0} toneMapped={false} />
      </mesh>
      <mesh position={[2.2, 4.2, 0]} rotation={[0, 0, -0.25]}>
        <boxGeometry args={[0.08, 0.03, 4.6]} />
        <meshStandardMaterial color="#e8eef8" emissive="#dfe8f7" emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
      <mesh position={[-2.2, 4.2, 0]} rotation={[0, 0, 0.25]}>
        <boxGeometry args={[0.08, 0.03, 4.6]} />
        <meshStandardMaterial color="#e8eef8" emissive="#dfe8f7" emissiveIntensity={1.4} toneMapped={false} />
      </mesh>

      {/* Polished Obsidian Showroom Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]} receiveShadow>
        <circleGeometry args={[28, 64]} />
        <meshStandardMaterial color="#07080b" roughness={0.22} metalness={0.68} envMapIntensity={0.85} />
      </mesh>

      {/* Grounded radial studio spotlight gradient & subtle contact shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
        <planeGeometry args={[9.5, 9.5]} />
        <meshBasicMaterial
          map={floorGlowTex}
          transparent
          opacity={0.78}
          depthWrite={false}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[2.5, 5.1]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.55} depthWrite={false} />
      </mesh>
    </>
  );
};

interface CameraRigProps {
  orbitMode: boolean;
  cockpitMode: boolean;
  activeHotspot: CarHotspot | null;
  isSoftwareGl: boolean;
  scrollProgressRef: React.MutableRefObject<number>;
  dragYawRef: React.MutableRefObject<number>;
  dragPitchRef: React.MutableRefObject<number>;
}

const CameraRig: React.FC<CameraRigProps> = ({
  orbitMode,
  cockpitMode,
  activeHotspot,
  isSoftwareGl,
  scrollProgressRef,
  dragYawRef,
  dragPitchRef,
}) => {
  const { camera } = useThree();
  const smoothYaw = useRef(0);
  const smoothPitch = useRef(0);

  const { posCurve, targetCurve } = useMemo(() => {
    const camPts = SCROLL_SCENES.map((s) => new THREE.Vector3(...s.cameraPos));
    const tgtPts = SCROLL_SCENES.map((s) => new THREE.Vector3(...s.targetPos));
    return {
      posCurve: new THREE.CatmullRomCurve3(camPts, false, 'centripetal', 0.45),
      targetCurve: new THREE.CatmullRomCurve3(tgtPts, false, 'centripetal', 0.45),
    };
  }, []);

  useFrame((_, delta) => {
    // If free 360 OrbitControls is active without an active preset, let OrbitControls handle camera
    if (orbitMode && !cockpitMode && !activeHotspot) {
      return;
    }

    const dt = Math.min(delta, 0.05);

    if (cockpitMode) {
      _desiredCamPos.set(0.31, 0.89, -0.06);
      _desiredTargetPos.set(0.31, 0.68, 0.72);
    } else if (activeHotspot) {
      _desiredCamPos.set(...activeHotspot.cameraPos);
      _desiredTargetPos.set(...activeHotspot.targetPos);
    } else {
      const t = THREE.MathUtils.clamp(scrollProgressRef.current, 0, 1);
      posCurve.getPointAt(t, _splineCamPos);
      targetCurve.getPointAt(t, _splineTargetPos);

      // Apply smooth interactive 360° drag offset around current target
      smoothYaw.current = THREE.MathUtils.damp(smoothYaw.current, dragYawRef.current, 6, dt);
      smoothPitch.current = THREE.MathUtils.damp(smoothPitch.current, dragPitchRef.current, 6, dt);

      _offsetVec.copy(_splineCamPos).sub(_splineTargetPos);
      const radius = _offsetVec.length();
      const baseTheta = Math.atan2(_offsetVec.x, _offsetVec.z);
      const basePhi = Math.acos(THREE.MathUtils.clamp(_offsetVec.y / Math.max(radius, 0.001), -1, 1));

      const theta = baseTheta + smoothYaw.current;
      const phi = THREE.MathUtils.clamp(basePhi + smoothPitch.current, 0.14, Math.PI * 0.465);

      _desiredCamPos.set(
        _splineTargetPos.x + radius * Math.sin(phi) * Math.sin(theta),
        _splineTargetPos.y + radius * Math.cos(phi),
        _splineTargetPos.z + radius * Math.sin(phi) * Math.cos(theta)
      );
      _desiredTargetPos.copy(_splineTargetPos);
    }

    const lambda = activeHotspot || cockpitMode ? 5.5 : 7.5;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, _desiredCamPos.x, lambda, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, _desiredCamPos.y, lambda, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, _desiredCamPos.z, lambda, dt);

    _currentLookAt.x = THREE.MathUtils.damp(_currentLookAt.x, _desiredTargetPos.x, lambda, dt);
    _currentLookAt.y = THREE.MathUtils.damp(_currentLookAt.y, _desiredTargetPos.y, lambda, dt);
    _currentLookAt.z = THREE.MathUtils.damp(_currentLookAt.z, _desiredTargetPos.z, lambda, dt);

    camera.lookAt(_currentLookAt);
  });

  if (orbitMode && !cockpitMode && !activeHotspot) {
    return (
      <OrbitControls
        makeDefault
        target={[0, 0.5, 0]}
        enableDamping={!isSoftwareGl}
        dampingFactor={0.055}
        enablePan={false}
        minDistance={2.2}
        maxDistance={8.5}
        minPolarAngle={0.12}
        maxPolarAngle={Math.PI * 0.475}
        rotateSpeed={0.75}
      />
    );
  }

  return null;
};

const _projVec = new THREE.Vector3();

interface HotspotProjectorProps {
  enabled: boolean;
  hotspotRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
}

const HotspotProjector: React.FC<HotspotProjectorProps> = ({
  enabled,
  hotspotRefs,
}) => {
  const { camera, size } = useThree();

  useFrame(() => {
    if (!enabled) return;
    for (let i = 0; i < CAR_HOTSPOTS.length; i++) {
      const btn = hotspotRefs.current[i];
      if (!btn) continue;
      const [hx, hy, hz] = CAR_HOTSPOTS[i].position;
      _projVec.set(hx, hy, hz).project(camera);

      // Hide if behind camera
      if (_projVec.z > 1 || _projVec.z < -1) {
        btn.style.opacity = '0';
        btn.style.pointerEvents = 'none';
        continue;
      }

      const x = (_projVec.x * 0.5 + 0.5) * size.width;
      const y = (-_projVec.y * 0.5 + 0.5) * size.height;

      btn.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
    }
  });

  return null;
};

export const ShowroomStage: React.FC<ShowroomStageProps> = ({
  finish,
  lightsOn,
  exploded,
  orbitMode,
  cockpitMode,
  showHotspots,
  activeHotspot,
  onSelectHotspot,
  scrollProgressRef,
  onDragInteract,
}) => {
  const [isSoftwareGl] = useState(() => detectSoftwareWebGL());
  const [contextLost, setContextLost] = useState(false);

  const dragYawRef = useRef(0);
  const dragPitchRef = useRef(0);
  const draggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const hotspotRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Reset manual drag offset whenever user actively scrolls far or resets
  useEffect(() => {
    const onScroll = () => {
      if (draggingRef.current) return;
      dragYawRef.current *= 0.88;
      dragPitchRef.current *= 0.88;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (orbitMode || cockpitMode) return;
    draggingRef.current = true;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || orbitMode || cockpitMode) return;
    const dx = e.clientX - lastPointerRef.current.x;
    const dy = e.clientY - lastPointerRef.current.y;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };

    dragYawRef.current -= dx * 0.008;
    dragPitchRef.current = THREE.MathUtils.clamp(dragPitchRef.current - dy * 0.004, -0.35, 0.35);
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
      onDragInteract?.();
    }
  };

  const handlePointerUp = () => {
    draggingRef.current = false;
  };

  if (contextLost) {
    return (
      <div className="relative h-full w-full flex items-center justify-center bg-[#050506]">
        <img
          src="/src/assets/images/huracan_aero_windtunnel_1794998143712.jpg"
          alt="Lamborghini Huracán Tecnica Studio Preview"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050506] via-transparent to-[#050506]/60 flex items-end justify-center pb-24">
          <button
            type="button"
            onClick={() => setContextLost(false)}
            className="px-6 py-2.5 rounded-full border border-white/25 bg-[#0c0d10] text-sm text-white hover:border-[#c9a25e] transition-colors"
          >
            Restore 3D Studio
          </button>
        </div>
      </div>
    );
  }

  const hotspotsVisible = showHotspots && !cockpitMode;

  return (
    <div
      className={`relative h-full w-full select-none ${
        orbitMode ? 'cursor-grab active:cursor-grabbing' : 'cursor-ew-resize'
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <Canvas
        shadows={!isSoftwareGl}
        dpr={isSoftwareGl ? 1 : [1, 2]}
        camera={{ position: [0.0, 1.08, 6.4], fov: 38, near: 0.1, far: 100 }}
        gl={{
          antialias: !isSoftwareGl,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.12,
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          const canvas = gl.domElement;
          canvas.addEventListener('webglcontextlost', (ev) => {
            ev.preventDefault();
            setContextLost(true);
          });
          canvas.addEventListener('webglcontextrestored', () => {
            setContextLost(false);
          });
        }}
      >
        <StudioEnvironment isSoftwareGl={isSoftwareGl} />
        <CameraRig
          orbitMode={orbitMode}
          cockpitMode={cockpitMode}
          activeHotspot={activeHotspot}
          isSoftwareGl={isSoftwareGl}
          scrollProgressRef={scrollProgressRef}
          dragYawRef={dragYawRef}
          dragPitchRef={dragPitchRef}
        />

        <HuracanModel
          finish={finish}
          lightsOn={lightsOn}
          exploded={exploded}
          isSoftwareGl={isSoftwareGl}
          scrollProgressRef={scrollProgressRef}
        />

        <HotspotProjector enabled={hotspotsVisible} hotspotRefs={hotspotRefs} />
      </Canvas>

      {/* Native Projected 3D Hotspot Markers (React 19 safe, zero portal unmount errors) */}
      {hotspotsVisible && (
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
          {CAR_HOTSPOTS.map((hs, index) => {
            const isSelected = activeHotspot?.id === hs.id;
            return (
              <button
                key={hs.id}
                ref={(el) => {
                  hotspotRefs.current[index] = el;
                }}
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectHotspot(isSelected ? null : hs);
                }}
                aria-label={`Inspect ${hs.title}`}
                style={{ opacity: 0 }}
                className={`absolute top-0 left-0 flex items-center justify-center w-8 h-8 rounded-full border transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#c9a25e] ${
                  isSelected
                    ? 'bg-[#c9a25e] border-[#e5c485] text-[#050506]'
                    : 'bg-[#0b0c0f]/90 border-white/40 text-white hover:border-[#c9a25e]'
                }`}
              >
                <span className="font-mono-tabular text-[11px] font-semibold">
                  {index + 1}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

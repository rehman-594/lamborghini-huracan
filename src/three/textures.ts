import * as THREE from 'three';

/**
 * Procedural automotive PBR textures (zero external 404s):
 * - 2x2 twill carbon fiber weave
 * - Hexagonal honeycomb grille pattern
 * - Cross-drilled Carbon-Ceramic Brake (CCB) rotor with woven ceramic texture
 * - Tire tread & radial sidewall detail
 * - Gold Bull center-lock wheel cap emblem
 * - Digital TFT cockpit tachometer
 * - Studio floor spotlight vignette
 */

export function createCarbonFiberTexture(maxAnisotropy = 4): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#111216';
    ctx.fillRect(0, 0, size, size);
    const cell = 16;
    for (let y = 0; y < size; y += cell) {
      for (let x = 0; x < size; x += cell) {
        const diag = (x / cell + y / cell) % 2 === 0;
        const grad = ctx.createLinearGradient(x, y, x + cell, y + cell);
        if (diag) {
          grad.addColorStop(0, '#2e313a');
          grad.addColorStop(0.5, '#191b20');
          grad.addColorStop(1, '#0d0e11');
        } else {
          grad.addColorStop(0, '#0c0d10');
          grad.addColorStop(0.5, '#22252d');
          grad.addColorStop(1, '#111317');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, cell, cell);
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(14, 14);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function createHexGrilleTexture(maxAnisotropy = 4): THREE.CanvasTexture {
  const w = 128;
  const h = 110;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#050507';
    ctx.fillRect(0, 0, w, h);

    const r = 16;
    const dx = r * 1.5;
    const dy = r * Math.sqrt(3);

    ctx.strokeStyle = '#2b2e36';
    ctx.lineWidth = 2.4;

    for (let row = -1; row < 6; row++) {
      for (let col = -1; col < 8; col++) {
        const cx = col * dx;
        const cy = row * dy + (col % 2 === 0 ? 0 : dy / 2);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          const px = cx + Math.cos(a) * (r - 1.5);
          const py = cy + Math.sin(a) * (r - 1.5);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function createBrakeRotorTexture(maxAnisotropy = 4): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const cx = size / 2;
  const cy = size / 2;

  if (ctx) {
    // Dark silicon-carbide composite base
    const baseGrad = ctx.createRadialGradient(cx, cy, 70, cx, cy, 250);
    baseGrad.addColorStop(0, '#141519');
    baseGrad.addColorStop(0.38, '#1a1c22');
    baseGrad.addColorStop(0.42, '#3a3d46');
    baseGrad.addColorStop(0.75, '#464a54');
    baseGrad.addColorStop(0.97, '#343740');
    baseGrad.addColorStop(1, '#1c1e24');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, size, size);

    // Subtle carbon-ceramic crystal grain & concentric wear grooves
    for (let r = 108; r < 245; r += 2.5) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle =
        Math.floor(r) % 5 === 0
          ? 'rgba(255,255,255,0.08)'
          : 'rgba(0,0,0,0.22)';
      ctx.lineWidth = 1.0;
      ctx.stroke();
    }

    // 20 curved ventilation arms × 5 cross-drilled cooling holes
    const arms = 20;
    for (let a = 0; a < arms; a++) {
      const baseAngle = (a / arms) * Math.PI * 2;
      for (let d = 0; d < 5; d++) {
        const radius = 118 + d * 25;
        const angle = baseAngle + d * 0.085;
        const px = cx + Math.cos(angle) * radius;
        const py = cy + Math.sin(angle) * radius;

        // Chamfered bright rim around drill hole
        ctx.beginPath();
        ctx.arc(px, py, 5.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200,206,220,0.22)';
        ctx.fill();

        // Deep dark vent hole
        ctx.beginPath();
        ctx.arc(px, py, 3.8, 0, Math.PI * 2);
        ctx.fillStyle = '#070709';
        ctx.fill();
      }
    }

    // Center hat mounting bolts (10 floating bobbins)
    for (let b = 0; b < 10; b++) {
      const a = (b / 10) * Math.PI * 2;
      const px = cx + Math.cos(a) * 94;
      const py = cy + Math.sin(a) * 94;
      ctx.beginPath();
      ctx.arc(px, py, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = '#8e939e';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#181a20';
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function createTireTreadTexture(maxAnisotropy = 4): THREE.CanvasTexture {
  const w = 256;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#131417';
    ctx.fillRect(0, 0, w, h);

    // Circumferential main rain channels
    ctx.fillStyle = '#070709';
    [76, 116, 140, 180].forEach((x) => {
      ctx.fillRect(x, 0, 7, h);
    });

    // Asymmetric angled sport shoulder sipes
    ctx.strokeStyle = '#070709';
    ctx.lineWidth = 4;
    for (let y = -32; y < h + 32; y += 24) {
      ctx.beginPath();
      ctx.moveTo(16, y);
      ctx.lineTo(74, y + 18);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(240, y + 12);
      ctx.lineTo(186, y + 30);
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 14);
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function createCenterCapTexture(maxAnisotropy = 4): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const cx = size / 2;
  const cy = size / 2;

  if (ctx) {
    ctx.fillStyle = '#0c0d10';
    ctx.fillRect(0, 0, size, size);

    // Outer champagne gold bevel ring
    ctx.beginPath();
    ctx.arc(cx, cy, 114, 0, Math.PI * 2);
    ctx.strokeStyle = '#c9a25e';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Inner crest shield silhouette
    ctx.beginPath();
    ctx.moveTo(cx - 48, cy - 52);
    ctx.lineTo(cx + 48, cy - 52);
    ctx.lineTo(cx + 42, cy + 16);
    ctx.quadraticCurveTo(cx, cy + 68, cx, cy + 72);
    ctx.quadraticCurveTo(cx, cy + 68, cx - 42, cy + 16);
    ctx.closePath();
    ctx.fillStyle = '#14151a';
    ctx.fill();
    ctx.strokeStyle = '#d4af68';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Stylized geometric charging bull emblem in gold
    ctx.fillStyle = '#d4af68';
    ctx.beginPath();
    ctx.moveTo(cx - 26, cy + 18);
    ctx.lineTo(cx - 10, cy - 12);
    ctx.lineTo(cx + 16, cy - 18);
    ctx.lineTo(cx + 28, cy - 28);
    ctx.lineTo(cx + 22, cy - 8);
    ctx.lineTo(cx + 8, cy + 12);
    ctx.lineTo(cx - 4, cy + 28);
    ctx.closePath();
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function createCockpitClusterTexture(): THREE.CanvasTexture {
  const w = 512;
  const h = 220;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#06070a';
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2 + 10;

    // Outer hexagonal instrument border
    ctx.strokeStyle = 'rgba(201,162,94,0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(42, 24);
    ctx.lineTo(w - 42, 24);
    ctx.lineTo(w - 16, h / 2);
    ctx.lineTo(w - 42, h - 20);
    ctx.lineTo(42, h - 20);
    ctx.lineTo(16, h / 2);
    ctx.closePath();
    ctx.stroke();

    // Tachometer arc
    ctx.beginPath();
    ctx.arc(cx, cy, 74, Math.PI * 0.8, Math.PI * 2.2);
    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 74, Math.PI * 0.8, Math.PI * 1.92);
    ctx.strokeStyle = '#c9a25e';
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 74, Math.PI * 1.92, Math.PI * 2.2);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.fillStyle = '#f5f5f7';
    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('N', cx, cy + 12);

    ctx.fillStyle = '#c9a25e';
    ctx.font = '600 13px monospace';
    ctx.fillText('TRACK · 0 MPH', cx, cy + 44);

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('OIL 92°C', 48, 72);
    ctx.fillText('V10 NA', 48, 96);
    ctx.textAlign = 'right';
    ctx.fillText('LDVI ACTIVE', w - 48, 72);
    ctx.fillText('3.2 BAR', w - 48, 96);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createFloorGlowTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const grad = ctx.createRadialGradient(
      size / 2,
      size / 2,
      10,
      size / 2,
      size / 2,
      size / 2
    );
    grad.addColorStop(0, 'rgba(42, 45, 55, 0.55)');
    grad.addColorStop(0.45, 'rgba(18, 20, 26, 0.35)');
    grad.addColorStop(1, 'rgba(5, 5, 6, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

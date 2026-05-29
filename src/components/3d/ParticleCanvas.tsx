"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 1800;
const MOUSE_RADIUS   = 1.8;
const MOUSE_STRENGTH = 0.12;

export function ParticleCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Scene Setup ────────────────────────────────────────────────────────
    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── Geometry ───────────────────────────────────────────────────────────
    const positions  = new Float32Array(PARTICLE_COUNT * 3);
    const targets    = new Float32Array(PARTICLE_COUNT * 3);  // resting positions
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const colors     = new Float32Array(PARTICLE_COUNT * 3);
    const sizes      = new Float32Array(PARTICLE_COUNT);

    const colorA = new THREE.Color("#7c3aed"); // purple
    const colorB = new THREE.Color("#06b6d4"); // cyan
    const colorC = new THREE.Color("#a78bfa"); // light purple

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      // Spread across a wide field
      const x = (Math.random() - 0.5) * 14;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 4;

      targets[i3]     = x;
      targets[i3 + 1] = y;
      targets[i3 + 2] = z;
      positions[i3]   = x + (Math.random() - 0.5) * 2;
      positions[i3 + 1] = y + (Math.random() - 0.5) * 2;
      positions[i3 + 2] = z;

      // Mix between 3 colors
      const t = Math.random();
      const col = t < 0.4 ? colorA : t < 0.7 ? colorB : colorC;
      colors[i3]     = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;

      sizes[i] = Math.random() * 1.2 + 0.2;  // smaller: was 2.5+0.5
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions,  3));
    geometry.setAttribute("color",    new THREE.BufferAttribute(colors,     3));
    geometry.setAttribute("size",     new THREE.BufferAttribute(sizes,      1));

    // ── Shader Material (custom glow) ──────────────────────────────────────
    const material = new THREE.ShaderMaterial({
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          vColor = color;
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (180.0 / -mvPos.z);  // smaller scale: was 280
          gl_Position  = projectionMatrix * mvPos;
          // fade center (text area) AND edges for better contrast
          float d    = length(position.xy) / 8.0;
          float edge = clamp(1.0 - d * d * 0.5, 0.0, 1.0);
          // hollow out the centre so particles don't cover the headline
          float cx     = position.x / 5.0;
          float cy     = position.y / 3.5;
          float centre = clamp((cx*cx + cy*cy) - 0.15, 0.0, 1.0);
          vAlpha = edge * centre;
        }
      `,
      fragmentShader: `
        varying vec3  vColor;
        varying float vAlpha;
        void main() {
          // Soft circle with glow
          vec2  uv   = gl_PointCoord - 0.5;
          float dist = length(uv);
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, dist);
          gl_FragColor = vec4(vColor, alpha * vAlpha * 0.45);  // dimmer: was 0.85
        }
      `,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // ── Mouse ──────────────────────────────────────────────────────────────
    const mouse3D = new THREE.Vector3(9999, 9999, 0);
    const raycaster = new THREE.Raycaster();
    const mouseNDC  = new THREE.Vector2();
    const plane     = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const target3D  = new THREE.Vector3();

    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouseNDC.x =  ((e.clientX - rect.left)  / rect.width)  * 2 - 1;
      mouseNDC.y = -((e.clientY - rect.top)   / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouseNDC, camera);
      raycaster.ray.intersectPlane(plane, target3D);
      mouse3D.copy(target3D);
    };

    const onMouseLeave = () => { mouse3D.set(9999, 9999, 0); };

    mount.addEventListener("mousemove", onMouseMove);
    mount.addEventListener("mouseleave", onMouseLeave);

    // ── Resize ─────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // ── Animation ──────────────────────────────────────────────────────────
    let frame = 0;
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      frame += 0.004;

      const pos = geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const tx = targets[i3];
        const ty = targets[i3 + 1];
        const tz = targets[i3 + 2];

        // Organic drift using sine waves
        const wave  = Math.sin(frame + i * 0.17) * 0.012;
        const wave2 = Math.cos(frame * 0.7 + i * 0.23) * 0.008;

        // Distance from mouse
        const dx = pos[i3]     - mouse3D.x;
        const dy = pos[i3 + 1] - mouse3D.y;
        const distSq = dx * dx + dy * dy;
        const dist   = Math.sqrt(distSq);

        let fx = 0, fy = 0;
        if (dist < MOUSE_RADIUS && dist > 0.001) {
          // Repulsion — push particles away
          const force = (1 - dist / MOUSE_RADIUS) * MOUSE_STRENGTH;
          fx = (dx / dist) * force;
          fy = (dy / dist) * force;
        }

        // Spring back to target + drift + mouse
        velocities[i3]     += (tx - pos[i3])     * 0.018 + wave  + fx;
        velocities[i3 + 1] += (ty - pos[i3 + 1]) * 0.018 + wave2 + fy;
        velocities[i3 + 2] += (tz - pos[i3 + 2]) * 0.018;

        // Damping
        velocities[i3]     *= 0.88;
        velocities[i3 + 1] *= 0.88;
        velocities[i3 + 2] *= 0.88;

        pos[i3]     += velocities[i3];
        pos[i3 + 1] += velocities[i3 + 1];
        pos[i3 + 2] += velocities[i3 + 2];
      }

      geometry.attributes.position.needsUpdate = true;

      // Slow rotation
      particles.rotation.y = Math.sin(frame * 0.15) * 0.06;
      particles.rotation.x = Math.sin(frame * 0.1)  * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      mount.removeEventListener("mousemove", onMouseMove);
      mount.removeEventListener("mouseleave", onMouseLeave);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-auto"
      style={{ zIndex: 0 }}
    />
  );
}

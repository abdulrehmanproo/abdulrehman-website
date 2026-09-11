import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeCrystalCore: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 300;
    let height = container.clientHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    // Ambient and point lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLightCyan = new THREE.PointLight(0x00f0ff, 3, 20);
    pointLightCyan.position.set(4, 3, 4);
    scene.add(pointLightCyan);

    const pointLightPurple = new THREE.PointLight(0x8b5cf6, 3, 20);
    pointLightPurple.position.set(-4, -3, 3);
    scene.add(pointLightPurple);

    // Central Core Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Inner Core
    const coreGeom = new THREE.IcosahedronGeometry(1.3, 1);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x0a192f,
      emissive: 0x005577,
      specular: 0x00f0ff,
      shininess: 100,
      flatShading: true,
      transparent: true,
      opacity: 0.85
    });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    coreGroup.add(coreMesh);

    // Outer Cyber Wireframe
    const wireGeom = new THREE.IcosahedronGeometry(1.32, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const wireMesh = new THREE.Mesh(wireGeom, wireMat);
    coreGroup.add(wireMesh);

    // Floating Torus / Orbital Rings
    const ringGeom1 = new THREE.TorusGeometry(2.0, 0.03, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.6
    });
    const orbitalRing1 = new THREE.Mesh(ringGeom1, ringMat1);
    orbitalRing1.rotation.x = Math.PI * 0.35;
    coreGroup.add(orbitalRing1);

    const ringGeom2 = new THREE.TorusGeometry(2.3, 0.02, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.4
    });
    const orbitalRing2 = new THREE.Mesh(ringGeom2, ringMat2);
    orbitalRing2.rotation.y = Math.PI * 0.4;
    orbitalRing2.rotation.x = Math.PI * 0.2;
    coreGroup.add(orbitalRing2);

    // Surrounding Interactive Particle Dust
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const r = 2.5 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      positions[i] = r * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = r * Math.cos(phi);
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.06,
      transparent: true,
      opacity: 0.75
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Mouse tracking
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotationY = nx * 0.8;
      targetRotationX = -ny * 0.8;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      const time = Date.now() * 0.0015;
      coreGroup.rotation.y += 0.006;
      coreGroup.rotation.x += 0.003;

      orbitalRing1.rotation.z += 0.008;
      orbitalRing2.rotation.z -= 0.005;

      // Smooth mouse tilt
      coreGroup.rotation.y += (targetRotationY - coreGroup.rotation.y) * 0.05;
      coreGroup.rotation.x += (targetRotationX - coreGroup.rotation.x) * 0.05;

      // Subtle floating levitation
      coreGroup.position.y = Math.sin(time) * 0.15;
      particles.rotation.y = time * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 300;
      height = container.clientHeight || 300;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      coreGeom.dispose();
      coreMat.dispose();
      wireGeom.dispose();
      wireMat.dispose();
      ringGeom1.dispose();
      ringMat1.dispose();
      ringGeom2.dispose();
      ringMat2.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full relative z-0" />;
};

import React, { useEffect, useRef } from 'react';

export const CyberShaderBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    let animId: number;

    function syncSize() {
      if (!canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    syncSize();
    window.addEventListener('resize', syncSize);

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      varying vec2 v_texCoord;

      void main() {
        vec2 uv = v_texCoord;
        vec2 p = uv * 2.0 - 1.0;
        p.x *= u_resolution.x / max(u_resolution.y, 1.0);

        float t = u_time * 0.35;
        
        // Ambient cosmic wave / cyber grid glow
        float wave1 = sin(p.x * 2.5 + t + sin(p.y * 2.0 + t * 0.8)) * 0.5 + 0.5;
        float wave2 = cos(p.y * 3.0 - t * 0.7 + cos(p.x * 1.5 - t * 0.5)) * 0.5 + 0.5;
        
        // Interactive mouse warp effect
        vec2 mouseNorm = (u_mouse / max(u_resolution, vec2(1.0))) * 2.0 - 1.0;
        float distToMouse = length(p - mouseNorm * vec2(1.0, -1.0));
        float mouseGlow = smoothstep(0.8, 0.0, distToMouse) * 0.35;
        
        // Deep obsidian background
        vec3 baseColor = vec3(0.04, 0.06, 0.10);
        
        // Electric Neon Cyan & Vibrant Violet gradients
        vec3 cyan = vec3(0.0, 0.94, 1.0);
        vec3 violet = vec3(0.55, 0.25, 0.98);
        vec3 blueGlow = vec3(0.12, 0.35, 0.95);
        
        float intensity = pow(wave1 * wave2, 1.8) * 0.55;
        vec3 color = baseColor + mix(cyan, violet, wave1) * intensity * 0.45;
        color += blueGlow * (wave2 * 0.2);
        color += cyan * mouseGlow;
        
        // Subtle vignette
        float vig = 1.0 - length(p * 0.45);
        color *= clamp(vig, 0.3, 1.0);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    function createShader(type: number, source: string) {
      if (!gl) return null;
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl.VERTEX_SHADER, vs);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fs);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return;
    }

    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const pos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = window.innerHeight - event.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = (t: number) => {
      syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', syncSize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        gl.deleteBuffer(buffer);
      }
    };
  }, []);

  return (
    <div
      id="cyber-shader-container"
      className="fixed inset-0 w-full h-full pointer-events-none opacity-40 z-0 overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </div>
  );
};

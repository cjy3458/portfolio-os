"use client";

import { useEffect, useRef } from "react";

// ── 3D 수학 ──────────────────────────────────────────────────────────────────
type V3 = [number, number, number];

const cos = Math.cos, sin = Math.sin;

const rx = ([x, y, z]: V3, a: number): V3 => [x, y*cos(a)-z*sin(a), y*sin(a)+z*cos(a)];
const ry = ([x, y, z]: V3, a: number): V3 => [x*cos(a)+z*sin(a), y, -x*sin(a)+z*cos(a)];
const rz = ([x, y, z]: V3, a: number): V3 => [x*cos(a)-y*sin(a), x*sin(a)+y*cos(a), z];

/** 원근 투영 — FOV 거리의 카메라에서 (cx,cy) 중심으로 */
const proj = ([x, y, z]: V3, fov: number, cx: number, cy: number) => ({
  x: cx + x * fov / (z + fov),
  y: cy + y * fov / (z + fov),
});

// ── 큐브 지오메트리 ──────────────────────────────────────────────────────────
const VERTS: V3[] = [
  [-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
  [-1,-1, 1],[1,-1, 1],[1,1, 1],[-1,1, 1],
];
const EDGES: [number, number][] = [
  [0,1],[1,2],[2,3],[3,0],
  [4,5],[5,6],[6,7],[7,4],
  [0,4],[1,5],[2,6],[3,7],
];

interface Cube {
  px: number; py: number; pz: number;
  size: number;
  ax: number; ay: number; az: number;
  wx: number; wy: number; wz: number;
}

export default function BackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    const resize = () => { W = canvas.width = innerWidth; H = canvas.height = innerHeight; };
    resize();

    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    const cubes: Cube[] = Array.from({ length: 8 }, () => ({
      px: rnd(-W * 0.44, W * 0.44),
      py: rnd(-H * 0.44, H * 0.44),
      pz: rnd(120, 700),
      size: rnd(55, 145),
      ax: rnd(0, Math.PI * 2),
      ay: rnd(0, Math.PI * 2),
      az: rnd(0, Math.PI * 2),
      wx: rnd(-0.004, 0.004),
      wy: rnd(-0.006, 0.006),
      wz: rnd(-0.003, 0.003),
    }));

    /**
     * 투시 격자 (바닥 + 천장)
     *
     * 카메라: 화면 중심(cx, cy)에서 +Z 방향을 바라봄
     * 바닥:   카메라 아래 CAM_H 거리 → sy = cy + CAM_H * FOV / wz
     * 천장:   카메라 위  CEIL_H 거리 → sy = cy - CEIL_H * FOV / wz
     *
     * wz = n * GRID - scroll  (scroll이 커지면 격자가 앞으로 이동)
     */
    const GRID_FOV  = 400;
    const CAM_H     = 200;   // 카메라와 바닥 사이 거리
    const CEIL_H    = 180;   // 카메라와 천장 사이 거리
    const GRID_SIZE = 110;   // 격자 셀 월드 크기
    const GRID_ROWS = 26;    // 가로선 개수
    const GRID_COLS = 20;    // 세로선 개수 (양방향)
    const GRID_XSPREAD = 200; // 세로선 월드 x 간격

    let scroll = 0;

    const drawGrid = () => {
      scroll = (scroll + 0.5) % GRID_SIZE;

      const cx = W / 2;
      const cy = H / 2;

      // ── 바닥 가로선 ──
      for (let n = 0; n < GRID_ROWS; n++) {
        const wz = (n + 1) * GRID_SIZE - scroll;
        if (wz <= 0) continue;
        const sy = cy + CAM_H * GRID_FOV / wz;
        if (sy > H + 4) continue;

        const alpha = Math.min(0.22, 0.004 + 14 / wz);
        ctx.strokeStyle = `rgba(0,0,0,${alpha.toFixed(3)})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, sy);
        ctx.lineTo(W, sy);
        ctx.stroke();
      }

      // ── 바닥 세로선 ──
      const farWz  = GRID_ROWS * GRID_SIZE;
      const nearWz = GRID_SIZE * 0.25;
      for (let c = -GRID_COLS; c <= GRID_COLS; c++) {
        const wx   = c * GRID_XSPREAD;
        const farX = cx + wx * GRID_FOV / farWz;
        const farY = cy + CAM_H * GRID_FOV / farWz;
        const nearX = cx + wx * GRID_FOV / nearWz;
        const nearY = cy + CAM_H * GRID_FOV / nearWz;

        const t = Math.abs(c) / GRID_COLS;
        const alpha = 0.025 + (1 - t) * 0.09;
        ctx.strokeStyle = `rgba(0,0,0,${alpha.toFixed(3)})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(farX, Math.max(cy, farY));
        ctx.lineTo(nearX, Math.min(H, nearY));
        ctx.stroke();
      }

      // ── 천장 가로선 ──
      for (let n = 0; n < GRID_ROWS; n++) {
        const wz = (n + 1) * GRID_SIZE - scroll;
        if (wz <= 0) continue;
        const sy = cy - CEIL_H * GRID_FOV / wz;
        if (sy < -4) continue;

        const alpha = Math.min(0.14, 0.003 + 9 / wz);
        ctx.strokeStyle = `rgba(0,0,0,${alpha.toFixed(3)})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, sy);
        ctx.lineTo(W, sy);
        ctx.stroke();
      }

      // ── 천장 세로선 ──
      for (let c = -GRID_COLS; c <= GRID_COLS; c++) {
        const wx   = c * GRID_XSPREAD;
        const farX = cx + wx * GRID_FOV / farWz;
        const farY = cy - CEIL_H * GRID_FOV / farWz;
        const nearX = cx + wx * GRID_FOV / nearWz;
        const nearY = cy - CEIL_H * GRID_FOV / nearWz;

        const t = Math.abs(c) / GRID_COLS;
        const alpha = 0.015 + (1 - t) * 0.055;
        ctx.strokeStyle = `rgba(0,0,0,${alpha.toFixed(3)})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(farX, Math.min(cy, farY));
        ctx.lineTo(nearX, Math.max(0, nearY));
        ctx.stroke();
      }
    };

    const drawCubes = () => {
      const FOV = 560;
      const cx = W / 2, cy = H / 2;

      // 페인터 알고리즘: 멀리 있는 큐브부터 그림
      const sorted = [...cubes].sort((a, b) => b.pz - a.pz);

      for (const c of sorted) {
        const alpha = Math.max(0.05, 0.30 - c.pz / 2400);

        const verts = VERTS.map((v) => {
          let p: V3 = [v[0]*c.size, v[1]*c.size, v[2]*c.size];
          p = rx(p, c.ax);
          p = ry(p, c.ay);
          p = rz(p, c.az);
          return proj([p[0]+c.px, p[1]+c.py, p[2]+c.pz], FOV, cx, cy);
        });

        ctx.strokeStyle = `rgba(0,0,0,${alpha.toFixed(2)})`;
        ctx.lineWidth = 1.5;

        for (const [a, b] of EDGES) {
          ctx.beginPath();
          ctx.moveTo(verts[a].x, verts[a].y);
          ctx.lineTo(verts[b].x, verts[b].y);
          ctx.stroke();
        }

        c.ax += c.wx;
        c.ay += c.wy;
        c.az += c.wz;
      }
    };

    let raf: number;
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      drawGrid();
      drawCubes();
      raf = requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-1 pointer-events-none"
    />
  );
}
